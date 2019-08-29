import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import { datetimeToString } from './utilityCalls';
import { apiGetWorkItems, apiPostNewOrder } from './apiCalls';
import {NavLink} from 'react-router-dom';

function OrderNewOrders(props)
{
    //context from APP.js
    const userInformationFromContext = useContext(UserContext);
    const [workItems, setWorkitems] = useState('');
    const [output, setOutput] = useState('');
    const [errorInfo, setErrorInfo] = useState('');
    const [successInfo, setSuccessInfo] = useState('');
    function generateTable(data) {
        //tablehead
        let tableHead = [];
        for(var k in data[0]) {
            //jedes element
            
            tableHead.push(<th>{k}</th>);
        }
        //tablebody
        let tableBody = [];

        data.map((item, index) => {
            let row = [];
            //order-button
            let orderButton = <td><button onClick={() => orderItem(item)}>Order item</button></td>
            let descriptionInputfield = <td><input id={`extraInfoNewOrder${item.workitem_id}`}></input></td>            
            for(var k in item) {
                row.push(<td>{ k==='price' ? item[k]+'€' : item[k]}</td>);
            }
            row.push(descriptionInputfield);
            row.push(orderButton);
            tableBody.push(<tr>{row}</tr>)
        });
        return <div style={{textAlign:"center"}}><table className='newOrderTable' style={{textAlign:"left"}}><thead><tr className='newOrderTableHead'>{tableHead}</tr></thead><tbody className='newOrderTableBody'>{tableBody}</tbody></table></div>
}

async function orderItem(item) {
    console.log(item);
    let extra_information = document.getElementById(('extraInfoNewOrder'+item.workitem_id)).value;
    item.extra_information = extra_information;
    item.customerId = userInformationFromContext.userId; 
    var postRestul = ""; 
    postRestul = await apiPostNewOrder(item);
    if(postRestul.status) {
        setSuccessInfo('Order has been saved.');      
    } else {
        setErrorInfo('We could not process your order. An error occured.');
    }
}


useEffect(() => {      
        async function fetchWorkItems() {
            var result;
            let data = apiGetWorkItems().then((result) => {
                result = result;
                if(result.results.length > 0) {
                    setOutput(generateTable(result.results));
                } else {
                    setOutput('no data');
                }
            }).catch((err => {
                console.log("an error appeared while fetching data!");
                setOutput('no data');
            }));
        }
        fetchWorkItems();
        
        //fetch pre-configured order items = workitems.
      }, userInformationFromContext, output, errorInfo);

        return(
        <div className='newOrderTableDiv'>
            <h3> Works to order: </h3>
            <span className='newOrderTableDivSuccesInfo' style={{backgroundColor:'lightgreen'}}>{successInfo}</span>
            <span className='newOrderTableDivErrorInfo' style={{backgroundColor:'lightsalmon'}}>{errorInfo}</span>
            {output}
            <hr/>
            <NavLink className='newOrderNavlinkToOffer' exact to='/offers/'>-- Your request is not on the list? Click here to create a new offer! -- </NavLink>
        </div>  
        )   
 }

async function getWorkItems() {
    let data = await apiGetWorkItems();
    console.log(data);
    return data;
}


export {OrderNewOrders};