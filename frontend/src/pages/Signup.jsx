import React, { useState } from 'react'
import '../styles/Signup.css';
import {getBaseURL, checkEmailValidity} from '../utils/helperFunctions';
import { useNavigate } from 'react-router-dom';
import { Input, Stack, InputGroup, InputLeftElement, Heading, Link, Button, Text } from '@chakra-ui/react'
import { AtSignIcon, EmailIcon, LockIcon, InfoIcon } from '@chakra-ui/icons';
import axios from 'axios';
import {Toaster, toast} from 'react-hot-toast';

export default function Signup() {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        username : '',
        password : '',
        email : '',
        name : ''
    });

    const handleChange = (e)=>{
        const {name, value} = e.target;
        setUser({
            ...user,
            [name] : value
        })
    }

    const registerUser = async (e)=>{
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
        else if(!checkEmailValidity(user.email)){
            toast.error("Enter a valid email id");
            return;
        }
        else{
            const toastId = toast.loading("Creating User, please wait");
            await axios.post(getBaseURL()+'/user/signup', user)
            .then(res => {
                if(res.status === 201){
                    toast.success(res.data.message, {id : toastId});
                    setTimeout(()=>{
                        navigate('/');
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
                    <h1>Signup</h1>
                    <Stack spacing={3} style={{margin:'30px'}}>
                        <InputGroup>
                            <InputLeftElement pointerEvents='none'>
                                <InfoIcon color='gray.500' />
                            </InputLeftElement>
                            <Input type='text' placeholder='name' variant='filled' name='name' value={user.name} required onChange={handleChange} backgroundColor="transparent" border="1px solid rgba(255, 255, 255, 0.406)"/>
                        </InputGroup>
                        <InputGroup>
                            <InputLeftElement pointerEvents='none'>
                                <AtSignIcon color='gray.500' />
                            </InputLeftElement>
                            <Input type='text' placeholder='username' variant='filled' name='username' value={user.username} required maxLength={20} minLength={3} onChange={handleChange} backgroundColor="transparent" border="1px solid rgba(255, 255, 255, 0.406)"/>
                        </InputGroup>
                        <InputGroup>
                            <InputLeftElement pointerEvents='none'>
                                <EmailIcon color='gray.500' />
                            </InputLeftElement>
                            <Input type='email' placeholder='email' variant='filled' name='email' value={user.email} required onChange={handleChange} backgroundColor="transparent" border="1px solid rgba(255, 255, 255, 0.406)"/>
                        </InputGroup>
                        <InputGroup>
                            <InputLeftElement pointerEvents='none'>
                                <LockIcon color='gray.500' />
                            </InputLeftElement>
                            <Input type='password' placeholder='password' variant='filled' name='password' value={user.password} required maxLength={30} minLength={8} onChange={handleChange} backgroundColor="transparent" border="1px solid rgba(255, 255, 255, 0.406)"/>
                        </InputGroup>
                        <Button 
                            onClick={registerUser}
                            colorScheme='blue' 
                            borderRadius='8px' 
                            width='140px' 
                            bg='#43BEE5' 
                            _hover={{ color: '#303030' }}
                            alignSelf='center'
                            margin={'10px'}>
                            Signup
                        </Button>
                    </Stack>
                    <Text align={'center'} color={'white'}>
                        Already have account?{' '}
                        <Link color='blue.500' href='/'>
                            Login
                        </Link>
                    </Text>
                </form>
            </div>
            {/* Title Div */}
            <div style={{display: 'grid', placeItems: 'center'}} className='title-div-sg-lg'>
                <div style={{width: '80%'}}>
                    <Heading size={'2xl'} color={'#43BEE5'}>SmartFolio</Heading><br/>
                    <Heading color={'whiteAlpha.500'}>A Brilliant way to manage your Portfolio</Heading>
                    <Text fontSize={'2xl'} color={'whiteAlpha.500'}>Get started by creating account</Text>
                </div>
            </div>
            <Toaster />
        </div>
    );
}
