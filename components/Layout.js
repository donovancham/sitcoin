import { Container, Row } from "react-bootstrap"

export default function Layout({ children }) {
    return (
        <Container fluid>
            <Row>
                { children }
            </Row>
        </Container>
    )
}