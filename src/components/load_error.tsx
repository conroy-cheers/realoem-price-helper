import { type FC } from "react"

import type { ErrorMsg } from "~frontend/get_parts"

const LoadError: FC<{ error: ErrorMsg }> = (props) => {
  return <a href={props.error.url.toString()}>{props.error.msg}</a>
}

export default LoadError
