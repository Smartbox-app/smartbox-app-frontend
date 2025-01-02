import { useMemo } from "react"
import styled from "styled-components";

const StyledVersion = styled('div')({
    fontSize: 'inherit',
    textAlign: 'center',
    color: 'inherit'
})

export const AppVersion = () => {
    const version = useMemo(() => {
        return localStorage.getItem('v');
    }, [])

    return <StyledVersion>{version}</StyledVersion>
}