import { Container, Row } from "react-bootstrap"

export default function Layout({ children }) {
    return (
        <Container fluid>
            <Row>
                <div classname="content">
                    { children }
                </div>
            </Row>
        </Container>
    )
}