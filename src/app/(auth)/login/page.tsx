'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';
import { Smartphone, KeyRound, AlertCircle, Loader2, ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';

// اسکیما مرحله ۱: شماره موبایل
const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(11, 'شماره موبایل باید ۱۱ رقم باشد')
    .max(11, 'شماره موبایل باید ۱۱ رقم باشد')
    .regex(/^09\d{9}$/, 'فرمت شماره موبایل معتبر نیست (مثلاً 09123456789)'),
});

// اسکیما مرحله ۲: کد تایید
const codeSchema = z.object({
  code: z.string().min(4, 'کد ورود را وارد کنید'),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;
type CodeFormValues = z.infer<typeof codeSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isExpired = searchParams.get('expired') === 'true';

  const [step, setStep] = useState<1 | 2>(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(120); // تایمر ۲ دقیقه‌ای
  const [canResend, setCanResend] = useState(false);

  const { setAuthenticated } = useAuthStore();

  // فرم مرحله اول
  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
  });

  // فرم مرحله دوم
  const codeForm = useForm<CodeFormValues>({
    resolver: zodResolver(codeSchema),
  });

  // مدیریت تایمر معکوس
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // ارسال شماره موبایل (Step 1)
  const onSendPhone = async (data: PhoneFormValues) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      await authService.requestOtp(data.phoneNumber);
      setPhoneNumber(data.phoneNumber);
      setStep(2);
      setTimer(120);
      setCanResend(false);
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'خطا در ارسال کد. لطفاً مجدداً تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ارسال کد ورود (Step 2)
  const onConfirmCode = async (data: CodeFormValues) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      await authService.confirmOtp({
        phoneNumber,
        code: data.code,
      });
      setAuthenticated(true);
      router.push('/'); // ورود به پنل
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'کد وارد شده اشتباه یا منقضی شده است.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ارسال مجدد کد
  const handleResendCode = async () => {
    if (!canResend) return;
    setIsSubmitting(true);
    setServerError(null);
    try {
      await authService.requestOtp(phoneNumber);
      setTimer(120);
      setCanResend(false);
    } catch (err: any) {
      setServerError('خطا در ارسال مجدد کد.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-neutral-950 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-4">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">پنل مدیریت محتوای یدک‌چی</h1>
          <p className="mt-1 text-xs text-neutral-400">ورود اعضای تیم تولید محتوا و دیتا اینتری</p>
        </div>

        {isExpired && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>نشست کاری شما منقضی شده است. لطفاً مجدداً وارد شوید.</span>
          </div>
        )}

        {serverError && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* مرحله ۱: دریافت شماره موبایل */}
        {step === 1 && (
          <form onSubmit={phoneForm.handleSubmit(onSendPhone)} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">شماره موبایل مدیر / اپراتور</label>
              <div className="relative">
                <input
                  {...phoneForm.register('phoneNumber')}
                  type="text"
                  dir="ltr"
                  placeholder="09123456789"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 pl-10 text-left text-sm text-neutral-100 placeholder-neutral-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                />
                <Smartphone className="absolute left-3 top-3.5 h-4 w-4 text-neutral-500" />
              </div>
              {phoneForm.formState.errors.phoneNumber && (
                <p className="mt-1 text-xs text-red-400">{phoneForm.formState.errors.phoneNumber.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-semibold text-neutral-950 hover:bg-amber-400 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>در حال ارسال کد...</span>
                </>
              ) : (
                <span>ارسال کد ورود</span>
              )}
            </button>
          </form>
        )}

        {/* مرحله ۲: تایید کد ورود (OTP) */}
        {step === 2 && (
          <form onSubmit={codeForm.handleSubmit(onConfirmCode)} className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-neutral-950/60 p-3 border border-neutral-800 text-xs">
              <span className="text-neutral-400">کد پیامک‌شده به: <strong className="text-neutral-200" dir="ltr">{phoneNumber}</strong></span>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1 text-amber-500 hover:underline"
              >
                <span>ویرایش</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">کد تایید ورود</label>
              <div className="relative">
                <input
                  {...codeForm.register('code')}
                  type="text"
                  dir="ltr"
                  autoFocus
                  placeholder="کد ورود را وارد کنید"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 pl-10 text-center text-lg font-bold tracking-widest text-neutral-100 placeholder-neutral-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                />
                <KeyRound className="absolute left-3 top-3.5 h-4 w-4 text-neutral-500" />
              </div>
              {codeForm.formState.errors.code && (
                <p className="mt-1 text-xs text-red-400">{codeForm.formState.errors.code.message}</p>
              )}
            </div>

            {/* تایمر معکوس / ارسال مجدد */}
            <div className="flex items-center justify-center text-xs text-neutral-400">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="flex items-center gap-1.5 text-amber-500 hover:text-amber-400 font-medium"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>ارسال مجدد کد ورود</span>
                </button>
              ) : (
                <span>
                  امکان ارسال مجدد کد تا {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)} دیگر
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-semibold text-neutral-950 hover:bg-amber-400 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>در حال بررسی...</span>
                </>
              ) : (
                <span>تایید و ورود به پنل</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}