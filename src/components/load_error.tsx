import { type FC } from "react"

import type { ErrorMsg } from "~frontend/get_parts"

const LoadError: FC<{ error: ErrorMsg }> = (props) => {
  return <span>{props.error.msg}</span>
}

export default LoadError
