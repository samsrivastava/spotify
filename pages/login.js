import {getProviders, signIn} from "next-auth/react";
import { useState } from 'react';
import { useEffect } from 'react';


const Login = () => {
    const [providers, setProviders] = useState(null);
  
    useEffect(() => {
      (async () => {
        const res = await getProviders();
        setProviders(res);
      })();
    }, []);
  
    return (
      <>
      <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
      <img className="w-52 mb-5" src="https://links.papareact.com/9xl" alt="" />
        {providers &&
          Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button className="bg-[#18D860] text-white p-3 font-bold rounded-lg"
                onClick={() => {
                  signIn(provider.id, { callbackUrl:"/" } );
                }}
              >
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        </div>
      </>
    );
  };

export default Login;
