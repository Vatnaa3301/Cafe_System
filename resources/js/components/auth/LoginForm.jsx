import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SignInButton from '../ui/SignInButton';
import StyledInput from '../ui/StyledInput';
import styled from 'styled-components';

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0ebe3;
  padding: 2rem;
`;

const Card = styled.div`
  background: #f0f0f0;
  border: 4px solid #000;
  box-shadow: 12px 12px 0 #000;
  width: 100%;
  max-width: 440px;
  padding: 2.5rem 2rem;
`;

const LogoBadge = styled.div`
  width: 56px;
  height: 56px;
  background: rgb(231, 76, 60);
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.75rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #000;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #555;
  text-align: center;
  margin-top: 0.25rem;
`;

const ErrorBox = styled.div`
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  background: #fff0f0;
  border: 2px solid #000;
  box-shadow: 3px 3px 0 #000;
  font-size: 0.85rem;
  font-weight: bold;
  color: #c0392b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DemoBox = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background: #e9b50b;
  border: 2px solid #000;
  box-shadow: 4px 4px 0 #000;
  font-size: 0.75rem;
  color: #000;

  p { margin: 0; }
  .title { font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.4rem; }
  span { font-family: monospace; font-weight: bold; }
`;

export default function LoginForm() {
    const { login }          = useAuth();
    const navigate           = useNavigate();
    const [form, setForm]    = useState({ email: '', password: '' });
    const [error, setError]  = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await login(form);
            navigate(user.role === 'admin' ? '/admin/dashboard' : '/cashier', { replace: true });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.errors?.email?.[0] ||
                'Login failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageWrapper>
            <Card>
                {/* Logo */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <LogoBadge>
                        <svg style={{ height: '28px', width: '28px', color: '#000', stroke: '#000' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M17 8h1a4 4 0 010 8h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" />
                            <path d="M6 2v2M10 2v2M14 2v2" />
                        </svg>
                    </LogoBadge>
                    <Title>Vat' Milktea</Title>
                    <Subtitle>Sign in to your account</Subtitle>
                </div>

                {error && <ErrorBox>{error}</ErrorBox>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingTop: '0.5rem' }}>
                    <StyledInput
                        label="EMAIL"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                        autoFocus
                    />
                    <StyledInput
                        label="PASSWORD"
                        type="password"
                        name="password"
                        placeholder="enter password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <SignInButton type="submit" disabled={loading}>
                        {loading ? 'Signing in…' : 'Sign in'}
                    </SignInButton>
                </form>

                <DemoBox>
                    <p className="title">Demo credentials</p>
                    <p>Admin: <span>admin@cafe.com</span> / <span>password</span></p>
                    <p>Cashier: <span>cashier@cafe.com</span> / <span>password</span></p>
                </DemoBox>
            </Card>
        </PageWrapper>
    );
}
