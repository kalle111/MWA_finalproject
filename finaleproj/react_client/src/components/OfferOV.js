import React, { useContext, useEffect, useState } from 'react';
import { apiGetOfferInformation, apiDeleteOffer, apiUpdateOfferInformation, apiPostofferAccepReject, apiPostNewOrder, apiGetOfferInformationAdmin, apiGetOfferInformationAdminFiltered, apiGetOfferStatus, apiSendAnswer } from './apiCalls';
import { UserContext } from '../App';
import { datetimeToString, replaceAll } from './utilityCalls';



function OfferOV(props)
{

    const LoadingIndicator = () => (
        <div style={{paddingLeft: '222px', paddingTop: '75px'}}>
          <i className="fa fa-spinner fa-spin" /> Loading...
        </div>
      );

  const userInformationFromContext = useContext(UserContext);
  const [output, setOutput] = useState(LoadingIndicator); //used for html output to be renderd + as Loading symbol while fetching.
  const [reload, setReload] = useState(true); // will always jump from true to false ...
  const [typesFetched, setTypesFetched] = useState(false);
  const [offerData, setofferData] = useState('');
  const [tBody, setTBody] = useState('');
  const [modifyableRows, setModifyableRows] = useState('');
  const [modificationDesc, setModificationDesc] = useState('');
  const [modificationInformation, setModificationInformation] = useState('');
  const [updateInfo, setUpdateInfo] = useState('');
  const [filterObj, setFilterObj] = useState('');
  const [statusArr, setStatusArr] = useState('');
  const [statusOptions, setStatusOptions] = useState('');
  const [answerMode, setAnswerMode] = useState(false);

  function generateTable(data, prefetchStatus) {
    
    let noData = 'noData'
    let tableHead = [];
    for(var k in data[0]) {
        //Create tablehead and shorten names (better to do in SQL query though)
        var l = null;
        if(k.includes('offer_')) {
            l = k.replace("offer_", "");
            tableHead.push(<th>{l}</th>);
        }else if (k.includes('datetime_')) {
            l = k.replace("datetime_", "");
            tableHead.push(<th>{l}</th>);
        } else {
            tableHead.push(<th>{k}</th>);
        }
    }
    let tableBody = [];


    var statusArray = [];
    console.log("prefetchStatus: ",prefetchStatus);

    if(prefetchStatus.length > 0) {
        statusArray = generateSelections(prefetchStatus);
        setStatusArr(statusArray);
    } 

    if(data.length < 1 || data.statusCode === 404) {
        // in case there's an issue with the db/node-server connection, 
        // or just a lack of data.
        if(data.statusCode === 404) {
            noData = 'An error occured while fetching offer data.';
            setUpdateInfo(noData);
        }
        else {
            noData = 'No data - You havent made any offers yet.';
            setUpdateInfo(noData);
        }
        noData = null;
        setOutput('');
        return <div className='offerOverviewTableNoDataDiv'><b>{noData}</b></div>
    } else {
    data.map((item,index) =>  {
        //InfoMessage won't be displayed if fetch was successfull with multiple hits.
        setUpdateInfo('');


        //modifications:
        /*
        only description and extra_information ought to be modified, otherwise an offer needs to be made!
        */
        let delButton = <td><button disabled={true} onClick={()=>modifyoffer(item.offer_id)}>modify</button></td>
        let modButton = <td><button disabled={false} onClick={()=>deleteoffer(item.offer_id)}>delete</button></td>
        
        //change dateformats. 
        let requested_date = datetimeToString(item.datetime_requested);
        let answered_date = datetimeToString(item.datetime_aswered);
        let accrej_date = datetimeToString(item.datetime_accepted_rejected);
        //let accrej_date = datetimeToString(item.offer_accrej_date);
        if(modifyableRows === item.offer_id) {
            //modify row mode!
            if(userInformationFromContext.userType === 'customer') {
            tableBody.push(
                <tr key={index}>
                    <td>{item.offer_id}</td>
                    <td><input type='text' className='OfferOverviewEditableUserInput' id={`offer_title_id${item.offer_id}`} defaultValue={item.offer_title}></input></td>
                    <td><input type='text' className='OfferOverviewEditableUserInput' id={`offer_desc_id${item.offer_id}`} defaultValue={item.offer_desc}></input></td>
                    <td>{item.offer_consumerId}</td>
                    <td>{item.offer_cost === null? '-' : item.offer_cost}</td>
                    <td>{item.offer_status}</td>
                    <td><textarea className='OfferOverviewEditableUserInput' id={`offer_extra_information_id${item.offer_id}`} name='offer_extra_information' cols="50" rows="1" defaultValue={item.offer_desc}></textarea></td>
                    <td>{requested_date}</td><td>{answered_date}</td><td>{accrej_date}</td>
                    <td><button disabled={false} onClick={()=>modifyRequest(index,item.offer_id)}>save</button></td>
                    <td><button disabled={false} onClick={()=>modifyoffer(item)}>cancel</button></td>
                </tr>
            );
            } else {
                
                if(answerMode) {
                    tableBody.push(
                        <tr key={index}>
                        <td>{item.offer_id}</td>
                        <td>{item.offer_consumerId}</td>
                        <td>{item.lastname}</td>
                        <td>{item.firstname}</td>
                        <td><input type='text' className='OfferOverviewEditableUserInput' id={`offer_title_id${item.offer_id}`} defaultValue={item.offer_title}></input></td>
                        <td><input type='text' className='OfferOverviewEditableUserInput' id={`offer_desc_id${item.offer_id}`} defaultValue={item.offer_desc}></input></td>
                        <td><input type='text' className='OfferOverviewEditableUserInput' id={`offer_cost${item.offer_id}`} defaultValue={item.offer_cost}></input></td>
                        <td><textarea className='OfferOverviewEditableUserInput' id={`offer_extra_information_id${item.offer_id}`} name='offer_extra_information' cols="50" rows="1" defaultValue={item.offer_extra_information}></textarea></td>
                        <td>{requested_date}</td><td>{answered_date}</td><td>{accrej_date}</td>
                        <td>{item.offer_status}</td>
                        <td><button disabled={false} onClick={()=>answerRequest(index,item.offer_id)}>Send answer</button></td>
                        <td><button disabled={false} onClick={()=>answerOffer(item)}>cancel</button></td>
                    </tr>
                    );
                } else {
                    tableBody.push(
                        <tr key={index}>
                        <td>{item.offer_id}</td>
                        <td>{item.offer_consumerId}</td>
                        <td>{item.lastname}</td>
                        <td>{item.firstname}</td>
                        <td><input type='text' className='OfferOverviewEditableUserInput' id={`offer_title_id${item.offer_id}`} defaultValue={item.offer_title}></input></td>
                        <td><input type='text' className='OfferOverviewEditableUserInput' id={`offer_desc_id${item.offer_id}`} defaultValue={item.offer_desc}></input></td>
                        <td><input type='text' className='OfferOverviewEditableUserInput' id={`offer_cost${item.offer_id}`} defaultValue={item.offer_cost}></input></td>
                        <td><textarea className='OfferOverviewEditableUserInput' id={`offer_extra_information_id${item.offer_id}`} name='offer_extra_information' cols="50" rows="1" defaultValue={item.offer_extra_information}></textarea></td>
                        <td>{requested_date}</td><td>{answered_date}</td><td>{accrej_date}</td>
                        <td>{item.offer_status}</td>
                        <td><button disabled={false} onClick={()=>modifyRequest(index,item.offer_id)}>save</button></td>
                        <td><button disabled={false} onClick={()=>modifyoffer(item)}>cancel</button></td>
                    </tr>
                    );
                }
            }   
        } else {
            if(userInformationFromContext.userType === 'customer') {
                if(item.offer_status === 'REQUESTED') {
                    tableBody.push(
                        <tr key={index}><td>{item.offer_id}</td><td>{item.offer_title}</td><td>{item.offer_desc}</td><td>{item.offer_consumerId}</td><td>{item.offer_cost === null? '-' : item.offer_cost}</td>
                        <td>{item.offer_status}</td><td>{item.offer_extra_information}</td><td>{requested_date}</td><td>{answered_date}</td><td>{accrej_date}</td>
                        <td><button disabled={false} onClick={()=>modifyoffer(item.offer_id)}>modify</button></td>
                        <td><button disabled={false} onClick={()=>deleteoffer(item)}>delete</button></td>
                        </tr>
                    );
                } else if(item.offer_status === 'ANSWERED') {
                    tableBody.push(
                    <tr key={index}><td>{item.offer_id}</td><td>{item.offer_title}</td><td>{item.offer_desc}</td><td>{item.offer_consumerId}</td><td>{item.offer_cost === null? '-' : item.offer_cost}</td>
                    <td>{item.offer_status}</td><td>{item.offer_extra_information}</td><td>{requested_date}</td><td>{answered_date}</td><td>{accrej_date}</td>
                    <td><button disabled={false} onClick={()=>acceptoffer(item)}>accept</button></td>
                    <td><button disabled={false} onClick={()=>rejectoffer(item)}>reject</button></td>
                    </tr>
                    );
                } 
                else 
                {
                    tableBody.push(
                        <tr key={index}><td>{item.offer_id}</td><td>{item.offer_title}</td><td>{item.offer_desc}</td><td>{item.offer_consumerId}</td><td>{item.offer_cost === null? '-' : item.offer_cost}</td>
                        <td>{item.offer_status}</td><td>{item.offer_extra_information}</td><td>{requested_date}</td><td>{answered_date}</td><td>{accrej_date}</td>

                        </tr>
                    );
                }
            } else {
                // if loginType === 'admin'
                let answerButton;
                if(item.offer_status === 'REQUESTED') {
                    answerButton =<td><button disabled={false} onClick={()=>answerOffer(item)}>answer</button></td>
                } else {
                    answerButton = <td><button disabled={true} onClick={()=>answerOffer(item)}>answer</button></td>
                }
                tableBody.push(
                    <tr key={index}>
                        <td>{item.offer_id}</td>
                        <td><b>{item.offer_consumerId}</b></td>
                        <td>{item.lastname}</td>
                        <td>{item.firstname}</td>
                        <td>{item.offer_title}</td>
                        <td>{item.offer_desc}</td>
                        <td>{item.offer_cost === null? '-' : item.offer_cost}</td>
                        <td>{item.offer_extra_information}</td>
                        <td>{requested_date}</td>
                        <td>{answered_date}</td>
                        <td>{accrej_date}</td>
                        <td>{item.offer_status}</td>
                        <select id={`changeStatusOption${item.offer_id}`}>
                            {statusArray}
                        </select>
                        <td><button disabled={false} onClick={()=>changeStatus(item)}>changeStatus</button></td>
                        {answerButton}
                        <td><button disabled={false} onClick={()=>modifyoffer(item.offer_id)}>modify</button></td>
                        <td><button disabled={false} onClick={()=>deleteoffer(item)}>delete</button></td>
                    </tr>
                );
            }
        }
        
        
    });
    if(data.length === 0) {
        return <div className='offerOverviewTableNoDataDiv'><b>{noData}</b></div>
    } else {
    return(
        <div className='offerOverviewTableDiv'>
            <h3> Your offers: </h3>
            <table className='offerOverViewTable'>
                <thead key='offerOverviewTableTHead'>
                    <tr key='offerOverviewTableHead'>{tableHead}</tr>
                </thead>
                <tbody key='offerOverviewTableTBody'>
                    {tableBody}
                </tbody>
            </table>
        </div>
        )
        }
    }
  } 
  async function modifyRequest(index,id) {
      //call api with item and field inputs
    if(userInformationFromContext.userType === 'admin') {
        let title = 'offer_title_id'+id;
        let desc = 'offer_desc_id'+id;
        let info = 'offer_extra_information_id'+id
        let cost = 'offer_cost'+id;
        let titleItem = document.getElementById(title).value;
        let descItem = document.getElementById(desc).value;
        let infoItem = document.getElementById(info).value;
        let costItem = document.getElementById(cost).value;

        let data = offerData;
        data[index].offer_title = titleItem;
        data[index].offer_desc = descItem;
        data[index].offer_extra_information = infoItem;
        data[index].offer_cost = costItem;

        setofferData(data); 
        let res = await apiUpdateOfferInformation(data[index]);
        setModifyableRows('');
        if(res.status) {
            setUpdateInfo("Offer #" + id + " has been successfully modified.");
        } else {
            console.log(res);
            setUpdateInfo("An error occured while updating offer #"+ id + ", errorInformation: " + res.errorInformation.errno);
        }
    } else {
        let title = 'offer_title_id'+id;
        let desc = 'offer_desc_id'+id;
        let info = 'offer_extra_information_id'+id

        let titleItem = document.getElementById(title).value;
        let descItem = document.getElementById(desc).value;
        let infoItem = document.getElementById(info).value;


        let data = offerData;
        data[index].offer_title = titleItem;
        data[index].offer_desc = descItem;
        data[index].offer_extra_information = infoItem;


        setofferData(data); 
        let res = await apiUpdateOfferInformation(data[index]);
        setModifyableRows('');
        if(res.status) {
            setUpdateInfo("Offer #" + id + " has been successfully modified.");
        } else {
            console.log(res);
            setUpdateInfo("An error occured while updating offer #"+ id + ", errorInformation: " + res.errorInformation.errno);
        }
    }



}

  function modifyoffer(offer_id) {
    if(modifyableRows === offer_id) {
        setModifyableRows('');
    } else {        
        setModifyableRows(offer_id);
    }
    //provoke reload.
    setReload(!reload);
  }

  // ############### delete
  async function deleteoffer(offer) {
    var result = await apiDeleteOffer(offer);
    if(result.status) {
        setUpdateInfo('Offer #' + offer.offer_id + " has been successfully deleted.")
    } else {
        setUpdateInfo('An error occured while deleting offer #' + offer.offer_id + '.');
    }
    setReload(!reload);
  }

  async function changeStatus(offer) {
    var newStatus = document.getElementById('changeStatusOption'+offer.offer_id).value;
    console.log(newStatus);
    let updatedOffer = offer;
    updatedOffer.offer_status = newStatus;
    console.log(updatedOffer);
    var res = await apiUpdateOfferInformation(updatedOffer);
    if(res.status) {
        setUpdateInfo("Offer #" + offer.offer_id + "'s status has been successfully modified to " + newStatus);
    } else {
        console.log(res);
        setUpdateInfo("An error occured while updating offer #"+ offer.offer_id + ", errorInformation: " + res.errorInformation.errno);
    }
    setReload(!reload);
  }


  async function answerRequest(index,id) {
    let title = 'offer_title_id'+id;
    let desc = 'offer_desc_id'+id;
    let info = 'offer_extra_information_id'+id
    let cost = 'offer_cost'+id;
    let titleItem = document.getElementById(title).value;
    let descItem = document.getElementById(desc).value;
    let infoItem = document.getElementById(info).value;
    let costItem = document.getElementById(cost).value;

    let data = offerData;
    data[index].offer_title = titleItem;
    data[index].offer_desc = descItem;
    data[index].offer_extra_information = infoItem;
    data[index].offer_cost = costItem;

    if(costItem === "") {
        setUpdateInfo("You need to enter a cost to answer an offer!");
    } else {
        setofferData(data); 
        let res = await apiSendAnswer(data[index]);
        setModifyableRows('');
        if(res.status) {
            setUpdateInfo("Offer #" + id + " has been successfully modified.");
        } else {
            console.log(res);
            setUpdateInfo("An error occured while updating offer #"+ id + ", errorInformation: " + res.errorInformation.errno);
        }
    }   
  }

  async function answerOffer(offer) {
      console.log("the following offer shall be answered: " + offer.offer_id);
      setAnswerMode(!answerMode);
      modifyoffer(offer.offer_id);
  }

  async function acceptoffer(offer){
    var res = await apiPostofferAccepReject(offer, "ACCEPTED");
    if(res.status) {
        //if successfull => create new Order.
        console.log("offer to post as new order: ", offer);
        var orderObject = {
            title : offer.offer_title,
            description : offer.offer_desc,
            workitem_id: 4, //fix item number for user-defined work
            customerId: offer.offer_consumerId,
            price: offer.offer_cost,
            extra_information: offer.offer_extra_information
        }
        var res_addNew = await apiPostNewOrder(orderObject);
        if(res_addNew.status) {
            console.log("res_addNew: ", res_addNew);
            setUpdateInfo('Offer # ' + offer.offer_id + " has been successfully accepted. You can find the associated order (#" + res_addNew.data.order_id + ") in your order overview.");
        } else {
            setUpdateInfo('Offer # ' + offer.offer_id + " has been successfully accepted. There were some error s with your order though.");
        }
    } else {
        setUpdateInfo('An error occured while accepting offer #' + offer.offer_id + '.');
    }
    setReload(!reload);
  }
  async function rejectoffer(offer) {
    var res = await apiPostofferAccepReject(offer, "REJECTED");
    if(res.status) {
        setUpdateInfo('Offer # ' + offer.offer_id + " has been successfully rejected.");
    } else {
        setUpdateInfo('An error occured while rejecting offer #' + offer.offer_id + '.');
    }
    setReload(!reload);
  }


  function generateSelections(prefetchData) {
    var arr = [];
    prefetchData.map((item1,index1) =>  {;
        arr.push(<option key={index1} value={item1.description}>{item1.description}</option>);
    });
    return arr;
}

function searchFilters() {
    console.log('send button clicked');
    var filterID, lastName, status;
    filterID = replaceAll(document.getElementById('filterID').value);
    lastName = replaceAll(document.getElementById('filterlastname').value);
    status = replaceAll(document.getElementById('filterstatus').value);

    var filterObj1 = {
        id : "",
        ln : "",
        stat: ""
    }

    if(filterID != '') {
        filterObj1.id = filterID;
    }
    if(status != '') {
        filterObj1.stat = status;
    }
    if(lastName != '') {
        filterObj1.ln = lastName;
    }


    //|| status === '' || lastName === ''
    console.log(filterID, lastName, status);
    setFilterObj(filterObj1);
    setReload(!reload);
}

  //----------------------------------------

  useEffect(() => {

    setOutput(LoadingIndicator);

    async function fetchOutputCustomer() {
            let data = await apiGetOfferInformation(userInformationFromContext);
            setofferData(data);
            try {
                setOutput(generateTable(data, ""));
            } catch (err) {
                console.log('an error occured');
                setOutput(err);
            }    
    }
    async function fetchOutputAdmin() {
        console.log('admin output should now be fetched.');
        var data;
        if(filterObj === '') {
            data = await apiGetOfferInformationAdmin(userInformationFromContext);
        } else {
            data = await apiGetOfferInformationAdminFiltered(userInformationFromContext, filterObj);
        }
        let prefetchStatus = await apiGetOfferStatus();
        await setofferData(data);
        await setStatusOptions(prefetchStatus);
        try {
            setOutput(generateTable(data, prefetchStatus));
        } catch(err) {
            console.log('an error occured while setting output and generating data table!');
            setOutput(err);
        }
    }
    
    // usertype cases to preload. 
    if(userInformationFromContext.userType === 'admin') {
        fetchOutputAdmin();
        
    } else {
        fetchOutputCustomer();
    }
  }, [reload, typesFetched, modifyableRows]);
        
  const errInfo = <span className='offerUpdateInfo' style={{backgroundColor:'lightsalmon'}}>{updateInfo}</span>
  const succInfo = <span className='offerUpdateInfo' style={{backgroundColor:'lightgreen'}}>{updateInfo}</span>
  
  const amdinInputFields = (
    <div>
        <label htmlFor='filterConsumerId'>ID: </label>
        <input type='text' id="filterID" name='filterConsumerId'></input>
        <label htmlFor='filterConsumerLastName'>Last name: </label>
        <input type='text' id="filterlastname" name='filterConsumerLastName'></input>
        <label htmlFor='filterOrderStatus'>Status: </label>
        <select type='text' id="filterstatus" name='filterOrderStatus'>
            <option key="0" value="0"> all </option>
            {statusArr}
        </select>
        <button onClick={()=>searchFilters()}> search </button>
        <hr/>
    </div>
    );
  
  return(
        <div>
            {userInformationFromContext.userType ==='admin' ? amdinInputFields : ''}
             {updateInfo.includes("error") ? errInfo : succInfo}
            {output}
           <hr/>
        </div>  
        )
        
 }




export {OfferOV};