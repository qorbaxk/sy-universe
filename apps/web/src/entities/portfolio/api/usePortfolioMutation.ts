import { useMutation } from '@tanstack/react-query'
import { submitContact, type ContactPayload } from './contactApi'

/**
 * @alias 문의 제출 mutation
 * @description Contact 패널 폼에서 사용한다.
 */
export function useSubmitContactMutation() {
  return useMutation({
    mutationFn: (payload: ContactPayload) => submitContact(payload),
  })
}
