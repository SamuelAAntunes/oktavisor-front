import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

function GroupsCollection (data) {
    const { isAuthenticated } = useAuth0()
    const history = useHistory();

    /*
    useEffect(() => {
      }, []);
    */

    if(!isAuthenticated) {
        history.push('/')
    }
    else {
        return(
            <div className='container'>
                <h4>Group management</h4>
            </div>
        )
    }
}

export default withAuthenticationRequired(GroupsCollection)