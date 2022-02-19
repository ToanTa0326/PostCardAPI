import { Button, Paper, TextField, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import FileBase from 'react-file-base64'
import { useDispatch } from 'react-redux';
import useStyles from './formStyle'
import { createPost, updatePost } from '../../actions/posts'
import { useNavigate } from 'react-router-dom';

const Form = ({currentId, setCurrentId}) => {
    const post = useSelector(state => currentId? state.posts.posts.find((p) => p._id === currentId) : null)
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    const navigate = useNavigate()
    
    useEffect(() => {
        if(post) setPostData(post)
    },[post])
    
    const [postData, setPostData] = useState({
        title: '',
        message: '',
        tags: '',
        selectedFile: null
    })

    const handleSubmit = (e) => {
        e.preventDefault();

        if(currentId){
            dispatch(updatePost(currentId,{...postData, name: user?.result?.name}))
        } else{
            dispatch(createPost({...postData, name: user?.result?.name}, navigate))
        }
        clear()
    }

    if(!user?.result?.name){
        return (
            <Paper className={classes.paper}>
                <Typography variant='h6' align='center'>
                    Please Sign In to create your own memories and like other's memories.
                </Typography>
            </Paper>
        )
    }

    const clear = () => {
        setCurrentId(null);
        setPostData({
            title: '',
            message: '',
            tags: '',
            selectedFile: null
        })
    }

    return (
        <Paper className={classes.paper} elevation={6}>
            <form 
                autoComplete='on' 
                noValidate 
                className={classes.form} 
                onSubmit={handleSubmit}
            >
                <Typography variant='h6' gutterBottom>
                    {currentId? 'Editing' : 'Creating'} a Memory
                </Typography>
                <TextField
                    className={classes.input}
                    name='title'
                    variant='outlined'
                    label='Title'
                    fullWidth
                    value={postData.title}
                    onChange={(e) => setPostData({
                        ...postData,
                        title: e.target.value
                    })}
                />
                <TextField
                    className={classes.input}
                    name='message'
                    variant='outlined'
                    label='Message'
                    fullWidth
                    value={postData.message}
                    onChange={(e) => setPostData({
                        ...postData,
                        message: e.target.value
                    })}
                />
                <TextField
                    className={classes.input}
                    name='tags'
                    variant='outlined'
                    label='Tags'
                    fullWidth
                    value={postData.tags}
                    onChange={(e) => setPostData({
                        ...postData,
                        tags: e.target.value.split(',')
                    })}
                />
                <div className={classes.fileInput}>
                    <FileBase 
                        type="file"
                        multiple={false}
                        onDone={({base64}) => setPostData({
                            ...postData,
                            selectedFile: base64
                        })}
                        value={postData.selectedFile}
                    />
                </div>
                <Button 
                    className={classes.buttonSubmit}
                    variant='contained'
                    color='primary'
                    size='large'
                    type='submit'
                    fullWidth
                >
                    Submit
                </Button>
                <Button 
                    variant='outlined'
                    color='secondary'
                    size='small'
                    onClick={clear}
                    fullWidth
                >
                    Clear
                </Button>
            </form>
        </Paper>
    )
}

export default Form