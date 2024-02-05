import { ArrowBackIcon } from '@chakra-ui/icons';
import { Button, ButtonGroup, Heading, VStack } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import TextField from '../components/TextField';

const SignUp = () => {
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={Yup.object({
        username: Yup.string()
          .required('Username is required')
          .min(6, 'Username too short')
          .max(28, 'Username too long'),
        password: Yup.string()
          .required('Password is required')
          .min(6, 'Password too short')
          .max(28, 'Password too long'),
      })}
      onSubmit={(values, actions) => {
        alert(JSON.stringify(values), null, 2);
        actions.resetForm();
      }}
    >
      <VStack
        as={Form}
        width={{ base: '90%', md: '500px' }}
        m='auto'
        justify='center'
        h='100vh'
        spacing={'1rem'}
      >
        <Heading>Sign Up</Heading>
        <TextField
          label='Username'
          name='username'
          placeholder='Enter Username'
          autoComplete='off'
          size='lg'
        />

        <TextField
          label='Password'
          type='password'
          name='password'
          placeholder='Enter Password'
          autoComplete='off'
          size='lg'
        />

        <ButtonGroup pt={'1rem'}>
          <Button colorScheme='teal' type='submit'>
            Create Account
          </Button>
          <Button onClick={() => navigate('/')} leftIcon={<ArrowBackIcon />}>
            Back
          </Button>
        </ButtonGroup>
      </VStack>
    </Formik>
  );
};

export default SignUp;
