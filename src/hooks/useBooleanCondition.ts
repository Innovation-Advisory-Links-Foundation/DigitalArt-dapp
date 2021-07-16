import React from "react"

// Custom boolean condition with toggle on/off callbacks.
export default function useBooleanCondition(
  start: boolean = false
): [boolean, () => void, () => void] {
  const [_status, setStatus] = React.useState<boolean>(start)

  function toggleOn() {
    setStatus(true)
  }

  function toggleOff() {
    setStatus(false)
  }

  return [_status, toggleOn, toggleOff]
}
