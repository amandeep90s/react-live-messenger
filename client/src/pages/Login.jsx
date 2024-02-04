import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  VStack,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Login = () => {
  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema: Yup.object({
      username: Yup.string()
        .required('Username is required')
        .min(6, 'Username too short')
        .max(28, 'Username too long'),
      password: Yup.string()
        .required('Password is required')
        .min(6, 'Password too short')
        .max(28, 'Password too long'),
    }),
    onSubmit: (values, actions) => {
      alert(JSON.stringify(values), null, 2);
      actions.resetForm();
    },
  });

  return (
    <VStack
      as='form'
      width={{ base: '90%', md: '500px' }}
      m='auto'
      justify='center'
      h='100vh'
      spacing={'1rem'}
      onSubmit={formik.handleSubmit}
    >
      <Heading>Log In</Heading>
      <FormControl
        isInvalid={formik.errors.username && formik.touched.username}
      >
        <FormLabel fontSize={'lg'}>Username</FormLabel>
        <Input
          name='username'
          placeholder='Enter username'
          autoComplete='off'
          size={'lg'}
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
      </FormControl>

      <FormControl
        isInvalid={formik.errors.password && formik.touched.password}
      >
        <FormLabel fontSize={'lg'}>Password</FormLabel>
        <Input
          type='password'
          name='password'
          placeholder='Enter password'
          autoComplete='off'
          size={'lg'}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
      </FormControl>

      <ButtonGroup pt={'1rem'}>
        <Button colorScheme='teal' type='submit'>
          Log In
        </Button>
        <Button>Create Account</Button>
      </ButtonGroup>
    </VStack>
  );
};

export default Login;
