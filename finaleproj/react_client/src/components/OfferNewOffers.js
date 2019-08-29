import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import { datetimeToString, replaceAll } from './utilityCalls';
import { apiPostNewOffer } from './apiCalls';
import {NavLink} from 'react-router-dom';

function OfferNewOffers(props)
{
    //context from APP.js
    const userInformationFromContext = useContext(UserContext);
    const [output, setOutput] = useState('');
    const [info, setInfo] = useState('');
    const [infoColor, setInfoColor] = useState({backgroundColor:'lightgray'});
    const [querySent, setQuerySent] = useState(false);
    
    
const form = (
<div className="newOfferFormDiv" action="" target="_self">

        <label htmlFor='username'>Work Title: </label><br/>
        <input required={true} id='offer_title' name='offer_title' type='text'></input><br/>
        <label htmlFor='offer_desc'>Work Description: </label><br/>
        <input required={true} id='offer_desc' name='offer_desc' type='text'></input><br/>
        <label htmlFor='offer_extra_information'>Work extra information: </label><br/>
        <textarea required={true} id='offer_extra_information' name='offer_extra_information' cols="50" rows="6" ></textarea><br/>
        <button id='submitOffer' onClick={(event) => handleOnSubmitOffer(event)}>Submit Offer</button>


        

</div>);

async function offerItem(item) {
    //console.log('>>> item to offer. ',item);
    let extra_information = document.getElementById(('extraInfoNewoffer'+item.workitem_id)).value;
    item.extra_information = extra_information;
    item.customerId = userInformationFromContext.userId; 
    var postRestul = ""; 
    
    postRestul = "";//await apiPostNewoffer(item);

    console.log(postRestul);
    if(postRestul === "success") {
        setInfoColor({backgroundColor:'lightgreen'});
        setInfo('offer has been saved.');      
    } else {
        setInfoColor({backgroundColor:'lightsalmon'});
        setInfo('We could not process your offer. An error occured.');
    }
}

async function handleOnSubmitOffer(event) {
    console.log('handlesubmit!!!!!!!!');
    var offer_title = document.getElementById('offer_title').value;
    var offer_desc = document.getElementById('offer_desc').value;
    var offer_extra_information = document.getElementById('offer_extra_information').value;
    var offer_title_blanks = replaceAll(offer_title, "");
    var offer_desc_blanks = replaceAll(offer_desc, "");
    var offer_extra_information_blanks = replaceAll(offer_extra_information, "");
    console.log(offer_extra_information);
    if(offer_title_blanks === '' || offer_desc_blanks === '' || offer_extra_information_blanks === '') {
        setInfoColor({backgroundColor:'lightsalmon'});
        setInfo('All input fields need to be filled-out!');
    } else {
        
        let result = await apiPostNewOffer(offer_title,offer_desc,offer_extra_information, userInformationFromContext);
        if(result.status) {
            console.log("after New Offer api call: ", result);
            setQuerySent(true);
            setInfoColor({backgroundColor:'lightgreen'});
            setInfo('offer has been saved.'); 
        } else {
            console.log("An error occured while sending your request. ", result.errorInformation);
            setInfoColor({backgroundColor:'lightsalmon'});
            setInfo('An error occured while sending your server-request.');
        }
    }
    

}




useEffect(() => {
        //fetch pre-configured offer items = workitems.
      }, userInformationFromContext, output, info);

        return(
        <div className='newofferTableDiv'>
            <h3> Request an individual work item per offer: </h3>
            <span className='newofferTableDivSuccesInfo' style={infoColor}>{info}</span><br/>
            {querySent ? '' : form}
            <hr/>
            <NavLink className='newofferNavlinkToOffer' exact to='/orders/'>-- You can check if the work you're selecting already exists. -- </NavLink>
        </div>  
        )   
 }
export {OfferNewOffers};