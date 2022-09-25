import { useCallback } from 'react'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  HeaderNavigation,
  HeaderNavigationType
} from '../models/HeaderNavigation'
import * as globalStateKey from './globalStateKey'

const headerNavigationRecoilState = atom<HeaderNavigation>({
  key: globalStateKey.headerNavigation,
  default: { currentIndex: HeaderNavigationType.content }
})

export const useHeaderNavigationState = () => {
  return useRecoilValue(headerNavigationRecoilState)
}

export const useHeaderNavigationMutators = () => {
  const setState = useSetRecoilState(headerNavigationRecoilState)

  const updateHeaderNavigation = useCallback(
    (navigation: HeaderNavigation | null) => {
      setState(navigation)
    },
    [setState]
  )

  const resetHeaderNavigation = useCallback(() => {
    setState({ currentIndex: HeaderNavigationType.content })
  }, [setState])

  return {
    updateHeaderNavigation,
    resetHeaderNavigation
  }
}
