import Layout from '../components/Layout';
import IdentityLogin from '../components/IdentityLogin';
import { Container } from 'react-bootstrap';

export default function login() {

    return (
        <Layout>
            <Container fluid style={{ 'margin-top': '50px' }}>
                <IdentityLogin />
            </Container>
        </Layout>
    )
}