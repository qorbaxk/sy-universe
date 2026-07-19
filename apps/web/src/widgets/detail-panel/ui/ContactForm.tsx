import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useSubmitContactMutation } from '@/entities/portfolio/api/usePortfolioMutation'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/Label'
import { Textarea } from '@/shared/ui/Textarea'

const contactSchema = z.object({
  name: z.string().min(1, '이름을 입력해 주세요').max(80),
  email: z.email('이메일 형식이 올바르지 않습니다').max(120),
  message: z.string().min(5, '메시지를 조금 더 적어 주세요').max(2000),
})

type ContactFormValues = z.infer<typeof contactSchema>

/**
 * @alias 문의 폼
 * @description Nest API가 SMTP로 메일을 발송한다.
 */
export function ContactForm() {
  const mutation = useSubmitContactMutation()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    await mutation.mutateAsync(values)
    reset()
  })

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <div className="space-y-1.5">
        <Label htmlFor="contact-name">이름</Label>
        <Input id="contact-name" autoComplete="name" {...register('name')} />
        {errors.name && (
          <p className="text-xs text-accent">{errors.name.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="contact-email">회신 받을 이메일</Label>
        <Input
          id="contact-email"
          type="email"
          autoComplete="email"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-accent">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="contact-message">메시지</Label>
        <Textarea id="contact-message" rows={4} {...register('message')} />
        {errors.message && (
          <p className="text-xs text-accent">{errors.message.message}</p>
        )}
      </div>

      {mutation.isError && (
        <p className="rounded-lg border border-accent/25 bg-accent/5 px-3 py-2 text-xs text-accent">
          {(mutation.error as Error).message}
        </p>
      )}
      {mutation.isSuccess && (
        <p className="rounded-lg border border-accent-2/30 bg-accent-2/10 px-3 py-2 text-xs text-accent-2">
          {mutation.data.message}
        </p>
      )}

      <Button
        type="submit"
        variant="accent"
        disabled={mutation.isPending}
        className="w-full"
      >
        {mutation.isPending ? '전송 중…' : '문의 보내기'}
      </Button>
    </form>
  )
}
