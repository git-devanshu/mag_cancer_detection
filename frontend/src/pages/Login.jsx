import React, { useState } from 'react'
import '../styles/Signup.css';
import {getBaseURL} from '../utils/helperFunctions';
import { useNavigate } from 'react-router-dom';
import { Input, Stack, InputGroup, InputLeftElement, Heading, Link, Button, Text } from '@chakra-ui/react'
import { AtSignIcon, LockIcon } from '@chakra-ui/icons';
import axios from 'axios';
import {Toaster, toast} from 'react-hot-toast';

export default function Login() {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        username : '',
        password : ''
    });

    const handleChange = (e)=>{
        const {name, value} = e.target;
        setUser({
            ...user,
            [name] : value
        })
    }

    const loginUser = async (e)=>{
        e.preventDefault();
        if(!e.target.form.reportValidity()){
            return;
        }
        else if(user.username === "" || user.password === ""){
            toast.error("All fields are required");
        }
        else if(user.username.length < 3 || user.username.length > 20){
            toast.error("Username should be 3 to 20 characters long");
        }
        else if(user.password.length < 8 || user.password.length > 30){
            toast.error("Password should be 8 to 30 characters long");
        }
        else{
            const toastId = toast.loading('Logging in...');
            await axios.put(getBaseURL()+'/user/login', user)
            .then(res => {
                if(res.status === 200){
                    toast.success(res.data.message, {id : toastId});
                    sessionStorage.setItem('token', res.data.token);
                    setTimeout(()=>{
                        navigate('/profile');
                    }, 1500);
                }
                else{
                    toast.error(res.data.message, {id : toastId});
                }
            })
            .catch(err => {
                console.error(err);
                toast.error(err.response.data.message, {id : toastId});
            })
        }
    }

    return (
        <div className='parent-sg'>
            {/* Form Div */}
            <div style={{display: 'grid', placeItems: 'center'}}>
                <form className='form-div-sg-lg'>
                    <h1>Login</h1>
                    <Stack spacing={5} style={{margin:'30px'}}>
                        <InputGroup>
                            <InputLeftElement pointerEvents='none'>
                                <AtSignIcon color='gray.500' />
                            </InputLeftElement>
                            <Input type='text' placeholder='username' variant='filled' name='username' value={user.username} required maxLength={20} minLength={3} onChange={handleChange} backgroundColor="transparent" border="1px solid rgba(255, 255, 255, 0.406)"/>
                        </InputGroup>
                        <InputGroup>
                            <InputLeftElement pointerEvents='none'>
                                <LockIcon color='gray.500' />
                            </InputLeftElement>
                            <Input type='password' placeholder='password' variant='filled' name='password' value={user.password} required maxLength={30} minLength={8} onChange={handleChange} backgroundColor="transparent" border="1px solid rgba(255, 255, 255, 0.406)"/>
                        </InputGroup>
                        <Text align={'center'}>
                            <Link color='blue.500' href='/reset-password'>
                                Forgot Password?
                            </Link>
                        </Text>
                        <Button 
                            onClick={loginUser}
                            colorScheme='blue' 
                            borderRadius='8px' 
                            width='140px' 
                            bg='#43BEE5' 
                            _hover={{ color: '#303030' }}
                            alignSelf='center'
                            margin={'10px'}>
                            Login
                        </Button>
                    </Stack>
                    <Text color={'white'} align={'center'}>
                        New User?{' '}
                        <Link color='blue.500' href='/signup'>
                            Signup
                        </Link>
                    </Text>
                </form>
            </div>
            {/* Title Div */}
            <div style={{display: 'grid', placeItems: 'center'}} className='title-div-sg-lg'>
                <div style={{width: '80%'}}>
                    <Heading size={'2xl'} color={'#43BEE5'}>SmartFolio</Heading><br/>
                    <Heading color={'whiteAlpha.500'}>A Brilliant way to manage your Portfolio</Heading>
                    <Text fontSize={'2xl'} color={'whiteAlpha.500'}>Welcome Back !</Text>
                </div>
            </div>
            <Toaster />
        </div>
    );
}
