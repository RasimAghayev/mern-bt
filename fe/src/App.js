import React,{Fragment} from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import './App.css';

//Redux

import {Provider} from 'react-redux'
import store from './store'

const App = () =>(
    <Provider store={store}>
        <Router>
        <Fragment>
            <Navbar/>
            <Route exact path='/' component={Landing} />
            <section clasName='container'>
                <Route exact path='/register' element={<Register/>}/>
                <Route exact path='/login' element={<Login/>}/>
            </section>
        </Fragment>
        </Router>
    </Provider>
)

export default App;
