import LogoImg from '@/assets/images/logo.png'
import { ComponentPropsWithRef } from 'react'

type Props = Omit<ComponentPropsWithRef<'img'>, 'src'>

export function Logo({ alt = 'Logo', ...props }: Props) {
  return <img alt={alt} src={LogoImg} {...props} />
}
