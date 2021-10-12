import * as React from "react";
import axios from "axios";

const authContext = React.createContext();

function useAuth({history}) {
  const [authed, setAuthed] = React.useState(false);

  return {
    authed,
    login(email, password) {
      return new Promise(() => {
        // using API function to submit data to Personal CRM API
        // loginUser({
        //     email: email,
        //     password: password
        // });
        axios({
          method: "POST",
          data: {
            email: email,
            password: password
          },
          withCredentials: true,
          url: "http://localhost:5000/login"
        }).then((response) => {
          console.log(response)
          if (response.data){
            setAuthed(true);
            window.localStorage.setItem("isAuthenticated", "true")
            console.log('successful login');
            history.push('/')
          } 
          else {
            alert('Wrong email or password');
          }
        }).catch(error => {
          console.log('server error');
          console.log(error);
        }) 
        
      });
    },
    register(email, password, username) {
        return new Promise(() => {
            // using API function to submit data to Personal CRM API
            // loginUser({
            //     email: email,
            //     password: password
            // });
            axios({
              method: "POST",
              data: {
                username: username,
                email: email,
                password: password
              },
              withCredentials: true,
              url: "http://localhost:5000/register"
            }).then((response) => {
              if (response.data){
                console.log('successful login');
               
                window.localStorage.setItem("isAuthenticated", "true")
                history.push('/')
              } 
              else {
                alert('email existing');
              }
            }).catch(error => {
              console.log('server error');
              console.log(error);
            })
        });
      }
    ,
    logout() {
      return new Promise(() => {
        axios.post('http://localhost:5000/logout', {}, {withCredentials: true});  
        setAuthed(false);
        history.push('/login');
      });
    }
  };
}

export function AuthProvider({ children }) {
  const auth = useAuth();

  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}

export default function AuthConsumer() {
  return React.useContext(authContext);
}




    