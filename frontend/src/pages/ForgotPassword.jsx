import React, {useState} from 'react'
import '../styles/Signup.css';
import { Input, Stack, InputGroup, InputLeftElement, Heading, Link, Button, Text, Image } from '@chakra-ui/react'
import { AtSignIcon, LockIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {Toaster, toast} from 'react-hot-toast';
import vfcodeIcon from '../images/vfcode.png';
import {getBaseURL} from '../utils/helperFunctions';

export default function ForgotPassword() {
    const navigate = useNavigate();

    const [showDiv, setShowDiv] = useState(false);
    const [username, setUsername] = useState('');
    const [vfcode, setVfcode] = useState('');
    const [password, setPassword] = useState('');

    const verifyUser = (e) =>{
        e.preventDefault();
        if(username === ''){
            toast.error('Please enter your username!');
            return;
        }
        else if(username.length < 3 || username.length > 20){
            toast.error('Username must be 3 and 20 characters long!');
            return;
        }
        else{
            const toastId = toast.loading('Verifying...');
            axios.put(`${getBaseURL()}/user/forgot-password/${username}`)
            .then(res => {
                if(res.status === 200){
                    console.log('response 200 received');
                    toast.success(res.data.message, {id :toastId});
                    setShowDiv(true);
                }
                else{
                    toast.error(res.data.message, {id :toastId});
                }
            })
            .catch(err =>{
                console.log(err);
                toast.error(err.response.data.message, {id :toastId});
            });
        }
    }

    const resetPassword = (e) =>{
        e.preventDefault();
        if(!vfcode || password === ''){
            toast.error('All fields are required');
            return;
        }
        else if(password.length < 8 || password.length > 30){
            toast.error('Password must be 8 and 30 characters long!');
            return;
        }
        else{
            const toastId = toast.loading('Setting new password...');
            axios.put(`${getBaseURL()}/user/reset-password/${username}`, {vfcode, password})
            .then(res =>{
                if(res.status === 200){
                    toast.success(res.data.message, {id :toastId});
                    setTimeout(()=>{
                        navigate('/')
                    }, 2000);
                }
                else{
                    toast.error(res.data.message, {id :toastId});
                }
            })
            .catch(err =>{
                console.log(err);
                toast.error(err.response.data.message, {id :toastId});
            });
        }
    }

    return (
        <div className='parent-sg'>
            <div style={{display: 'grid', placeItems: 'center'}}>
                <form className='form-div-sg-lg'>
                    <h1 style={{marginTop:'20px'}}>Reset Password</h1>
                    {!showDiv && (
                        <Stack spacing={5} style={{margin:'40px'}}>
                            <InputGroup>
                                <InputLeftElement pointerEvents='none'>
                                    <AtSignIcon color='gray.500' />
                                </InputLeftElement>
                                <Input type='text' placeholder='username' variant='filled' name='username' value={username} required maxLength={20} minLength={3} onChange={(e)=>setUsername(e.target.value)}/>
                            </InputGroup>
                            <Button 
                                onClick={verifyUser}
                                colorScheme='blue' 
                                borderRadius='8px' 
                                width='140px' 
                                bg='#43BEE5' 
                                _hover={{ color: '#303030' }}
                                alignSelf='center'
                                margin={'10px'}>
                                Verify
                            </Button>
                        </Stack>
                    )}
                    {showDiv && (
                        <Stack spacing={5} style={{margin:'30px'}}>
                            <InputGroup>
                                <InputLeftElement pointerEvents='none'>
                                    <Image
                                        boxSize='20px'
                                        objectFit='cover'
                                        src={vfcodeIcon}
                                        alt='vfcode'
                                        filter={'invert(35%)'}
                                    />
                                </InputLeftElement>
                                <Input type='text' placeholder='verification code' variant='filled' name='vfcode' value={vfcode} required maxLength={6} minLength={6} onChange={(e)=>setVfcode(e.target.value)}/>
                            </InputGroup>
                            <InputGroup>
                                <InputLeftElement pointerEvents='none'>
                                    <LockIcon color='gray.500' />
                                </InputLeftElement>
                                <Input type='password' placeholder='new password' variant='filled' name='password' value={password} required maxLength={30} minLength={8} onChange={(e)=>setPassword(e.target.value)}/>
                            </InputGroup>
                            <Button 
                                onClick={resetPassword}
                                colorScheme='blue' 
                                borderRadius='8px' 
                                width='140px' 
                                bg='#43BEE5' 
                                _hover={{ color: '#303030' }}
                                alignSelf='center'
                                margin={'10px'}>
                                Reset
                            </Button>
                        </Stack>
                    )}
                    <Text color={'white'} align={'center'}>
                        Try Login?{' '}
                        <Link color='blue.500' href='/'>
                            Login
                        </Link>
                    </Text>
                </form>
            </div>
            <div style={{display: 'grid', placeItems: 'center'}} className='title-div-sg-lg'>
                <div style={{width: '80%'}}>
                    <Heading size={'2xl'} color={'#43BEE5'}>SmartFolio</Heading><br/>
                    <Heading color={'whiteAlpha.500'}>Forgot your Password?</Heading>
                    <Text fontSize={'2xl'} color={'whiteAlpha.500'}>Don't worry, we've got a way!</Text>
                </div>
            </div>
            <Toaster />
        </div>
    )
}
