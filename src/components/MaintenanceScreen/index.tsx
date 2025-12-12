import { Settings } from "src/icons"
import styled from "styled-components"

const StyledContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    fontSize: '1.5rem',
    svg: {
        width: 200,
        height: 200,
        fill: '#000'
    }
})

export const MaintenanceScreen = () => {
    return <StyledContainer>
        <Settings />
        <p>Maksymalnie do 2:00 trwa przerwa techniczna, działanie systemu zostanie wznowione za kilka minut.</p>
    </StyledContainer>
}