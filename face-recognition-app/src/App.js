import React, { Component } from 'react';
import './App.css';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import ErrorValidation from './components/ErrorValidation/ErrorValidation';

const particlesOptions={
   particles: {
        number:{
          value: 50,
          density:{
            enable:true,
            value_area:800
          }
        }
   }
}

const initialState = {
      input:'',
      imageUrl:'',
      box:{},
      route:'signin',
      isSignedIn: false,
      error:'',
      user: {
          id: '',
          name: '',
          email: '',
          entries: 0,
          joined: ''
      }
};

class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }

  errorValidation = (data) => {
    this.setState({error:data});
  }

  loadUser = (data) => {
    this.setState({user:{
          id: data.id,
          name: data.name,
          email: data.email,
          entries: data.entries,
          joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      leftCol:clarifaiFace.left_col * width,
      topRow:clarifaiFace.top_row * height,
      rightCol:width - (clarifaiFace.right_col * width),
      bottomRow:height - (clarifaiFace.bottom_row * height)
    };
  }

  displayFaceBox = (box) => {
    this.setState({box:box});
  }

  onInputChange = (event) => {
    this.setState({input:event.target.value});
  }
  onButtonSubmit = (event) => {
    this.setState({imageUrl:this.state.input});
    fetch('http://localhost:3000/image',{ // making the api call here through server
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({  //stringify javascript object
              input:this.state.input
            })
    })
    .then(response => response.json()) //since the reponse is in json
    .then(response => {
      if(response){
        fetch('http://localhost:3000/image',{
          method: 'put',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({  //stringify javascript object
            id:this.state.user.id
          })
        })
        .then(response=>response.json())
        .then(count=>{
          this.setState(Object.assign(this.state.user,{entries:count})) //object assign value to particular user
        })
        .catch(console.log);
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));  
  }

  onRouteChange = (route) => {
    if(route ==='signout'){
      this.setState(initialState);
    }else if(route === 'home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route: route});
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles'
                params={particlesOptions}
        />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        { this.state.route=== 'home'
          ? <div>
              <Logo/>
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box}/>
            </div>
          :(
            this.state.route === 'register' ?
              <div>
                <ErrorValidation error={this.state.error}/>
                <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} errorValidation={this.errorValidation} />
              </div> 
             :<div>
                <ErrorValidation error={this.state.error}/>
                <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} errorValidation={this.errorValidation}/>
              </div>   
           )
       }
      </div>
    );
  }
}

export default App;
