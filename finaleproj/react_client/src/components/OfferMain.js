import React from 'react';
import { NavLink } from 'react-router-dom';
import { OfferNewOffers} from './OfferNewOffers';
import { OfferOV } from './OfferOV';
import { OfferManageOffers} from './OfferManageOffers';


export class OfferMain extends React.Component {
    //works both to persist parentStateData from login.
    constructor(props)
    {
        super(props);
        this.state = {
            isLoading: false,
            list: null,
            mode: 'overview',
            profileData: null,
            errorMsg: null
        }
        
    }

    async componentDidMount() {

    }
    goToOverview() {
        this.setState({mode: 'overview'});
    }
    goToNewOffer()
    {
        this.setState({mode: 'newoffer'});
    }   
    goToManageOffers () {
        this.setState({mode: 'manageoffers'});
    }
    renderOverview() {
        //prepare component
        return <b>overview rendered!</b>
    }
    renderNewOrder() {
        return <b> new order body</b>
    }
    render() {
        /*const headline = <h3>Userprofile of {this.props.data.userName}</h3>
        const saveButton = <button onClick={()=> this.saveEditedProfil()}>Save Profile</button>
        const errorSpan = <span className='errorSpanProfile'>{this.state.errorMsg}</span>*/
    
        const adminOffersMenu = 
        (
            <div className='offerMenuDiv'>
                <ul>
                    <li onClick={() => this.goToOverview()}>Search/Modify Offers</li>
                    <li onClick={() => this.goToNewOffer()}>assignment 5</li>

                </ul>
            </div>
        );
        const offersMenu = 
        (
        <div className='offerMenuDiv'>
            <ul>
                <li onClick={() => this.goToOverview()}>Offer Overview</li>
                <li onClick={() => this.goToNewOffer()}>New Offer</li>
            </ul>
        </div>
        );



    return(
        <div className='offersDiv'>
            {this.props.user.userType === 'admin' ? adminOffersMenu : offersMenu}
            <hr/>

            { this.state.mode === 'overview' ? <OfferOV/> : [this.state.mode === 'newoffer' ? <OfferNewOffers/> : [this.state.mode === 'manageoffers' ? <OfferManageOffers/> :'']]}
            <p>Current "this.state.mode" = {this.state.mode} 
            
            </p>

        </div>
        )
    }
}
