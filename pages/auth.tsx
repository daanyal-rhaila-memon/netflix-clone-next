import axios from 'axios';
import { useCallback, useState } from 'react';
import { NextPageContext } from 'next';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Input from '@/components/Input';

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}

const Auth = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [variant, setVariant] = useState('login');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) => currentVariant === 'login' ? 'register' : 'login');
    // Clear errors when switching variants
    setErrors({ email: '', password: '', name: '' });
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '', name: '' };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Name validation (only for register)
    if (variant === 'register' && !name) {
      newErrors.name = 'Username is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const login = useCallback(async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/'
      });

      if (result?.error) {
        setErrors({ name: result.error, email: result.error, password: result.error });
        return;
      }

      router.push('/profiles');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [email, password, router]);

  const register = useCallback(async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await axios.post('/api/register', {
        email,
        name,
        password
      });

      login();
    } catch (error: any) {
      if (error.response?.data?.error) {
        setErrors(prev => ({ ...prev, email: error.response.data.error }));
      }
    } finally {
      setIsLoading(false);
    }
  }, [email, name, password, login]);

  return (
    <div className="relative h-full w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
      <div className="bg-black w-full h-full lg:bg-opacity-50">
        <nav className="px-12 py-5">
          <img src="/images/logo.png" className="h-12" alt="Logo" />
        </nav>
        <div className="flex justify-center">
          <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
            <h2 className="text-white text-4xl mb-8 font-semibold">
              {variant === 'login' ? 'Sign in' : 'Register'}
            </h2>
            <div className="flex flex-col gap-4">
              {variant === 'register' && (
                <div>
                  <Input
                    id="name"
                    type="text"
                    label="Username"
                    value={name}
                    onChange={(e: any) => setName(e.target.value)}
                    error={errors.name}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
              )}
              <div>
                <Input
                  id="email"
                  type="email"
                  label="Email address"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  error={errors.email}
                />
                {/* {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>} */}
              </div>
              <div>
                <Input
                  type="password"
                  id="password"
                  label="Password"
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  error={errors.password}
                />
                {/* {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>} */}
                {errors.email && <p className="text-red-500 text-sm mt-1">email or password is incorrect</p>}
              </div>
            </div>
            <button
              onClick={variant === 'login' ? login : register}
              disabled={isLoading}
              className={`bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Loading...' : variant === 'login' ? 'Login' : 'Sign up'}
            </button>
            <p className="text-neutral-500 mt-12">
              {variant === 'login' ? 'First time using Netflix?' : 'Already have an account?'}
              <span onClick={toggleVariant} className="text-white ml-1 hover:underline cursor-pointer">
                {variant === 'login' ? 'Create an account' : 'Login'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
