import React, { useContext, useEffect, useState } from 'react';
import { apiGetOrderInformation, apiUpdateOrderInformation, apiDeleteOrder, apiPostOrderAccepReject, apiGetOrderInformationAdmin, apiGetOrderStatus, apiGetOrderInformationAdminFiltered, apiUpdateOrderStart, apiUpdateOrderFinish} from './apiCalls';
import { UserContext } from '../App';
import { datetimeToString, replaceAll } from './utilityCalls';


function OrderOV(props)
{

    const LoadingIndicator = () => (
        <div style={{paddingLeft: '222px', paddingTop: '75px'}}>
          <i className="fa fa-spinner fa-spin" marginLeft="22px"/> Loading...
        </div>
      );

  const userInformationFromContext = useContext(UserContext);
  const [statusOptions, setStatusOptions] = useState('');
  const [output, setOutput] = useState(LoadingIndicator); //used for html output to be renderd + as Loading symbol while fetching.
  const [reload, setReload] = useState(true); // will always jump from true to false ...
  const [typesFetched, setTypesFetched] = useState(false);
  const [orderData, setOrderData] = useState('');
  const [tBody, setTBody] = useState('');
  const [modifyableRows, setModifyableRows] = useState('');
  const [modificationDesc, setModificationDesc] = useState('');
  const [modificationInformation, setModificationInformation] = useState('');
  const [updateInfo, setUpdateInfo] = useState('');
  const [filterObj, setFilterObj] = useState('');
  const [statusArr, setStatusArr] = useState('');
  //const [modificationItems, setModificationItems] = useState('');
  //const [editMode, setEditMode] = useState(false);
  
  function generateTable(data, prefetchStatus) {
    
    let noData = 'noData'
    let tableHead = [];
    for(var k in data[0]) {
        //Create tablehead and shorten names (better to do in SQL query though)
        var l = null;
        if(k.includes('order_')) {
            l = k.replace("order_", "");
            tableHead.push(<th>{l}</th>);
        }else if (k.includes('extra_information')) {
            l = k.replace("extra_information", "info");
            tableHead.push(<th>{l}</th>);
        } else if (k.includes('_date')) {
            l = k.replace("_date", "");
            tableHead.push(<th>{l}</th>);
        } else {
            tableHead.push(<th>{k}</th>);
        }
    }
    let tableBody = [];
    

    //prefetching the selection options.
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
            noData = 'An error occured while fetching order data.';
            setUpdateInfo(noData);
        }
        else {
            noData = 'No data - customer has no order data available.';
            setUpdateInfo(noData);
        }
        noData = null;
        setOutput('');
        return <div className='orderOverviewTableNoDataDiv'><b>{noData}</b></div>
    } else {
    data.map((item,index) =>  {
        //console.log(`${index}. Order: ${item.order_price}`);
        
        //modifications:
        /*
        only description and extra_information ought to be modified, otherwise an order needs to be made!
        */
        let delButton = <td><button disabled={true} onClick={()=>modifyOrder(item.order_id)}>modify</button></td>
        let modButton = <td><button disabled={false} onClick={()=>deleteOrder(item.order_id)}>delete</button></td>
        
        //change dateformats. 
        let ordered_date = datetimeToString(item.order_ordered_date);
        let ready_date = datetimeToString(item.order_ready_date);
        let started_date = datetimeToString(item.order_started_date);
        let accrej_date = datetimeToString(item.order_accrej_date);
        if(modifyableRows === item.order_id) {
            if(userInformationFromContext.userType === 'customer') {
            tableBody.push(
                <tr key={index}>
                    <td>{item.order_id}</td>
                    <td>{item.title}</td>
                    <td><input type='text' className='OrderOverviewEditableUserInput' id={`input_description${item.order_id}`} defaultValue={item.description}></input></td>
                    <td>{ordered_date}</td>
                    <td>{started_date}</td>
                    <td>{ready_date}</td>
                    <td>{accrej_date}</td>
                    <td>{item.workitemId}</td>
                    <td>{item.status}</td>
                    <td><input type='text' className='OrderOverviewEditableUserInput' id={`input_information${item.order_id}`} defaultValue={item.extra_information}></input></td>
                    <td>{item.order_price}€</td>
                    <td><button disabled={false} onClick={()=>modifyRequest(index,item.order_id)}>save</button></td>
                    <td><button disabled={false} onClick={()=>modifyOrder(item)}>cancel</button></td>
                </tr>
            );
            } else {
                tableBody.push(
                    <tr key={index}>
                        <td>{item.order_id}</td>
                        <td>{item.customerId}</td>
                        <td>{item.lastname}</td>
                        <td>{item.firstname}</td>
                        <td><input type='text' className='OrderOverviewEditableUserInput' id={`input_title${item.order_id}`} defaultValue={item.title}></input></td>
                        <td><input type='text' className='OrderOverviewEditableUserInput' id={`input_description${item.order_id}`} defaultValue={item.description}></input></td>
                        <td>{ordered_date}</td>
                        <td>{started_date}</td>
                        <td>{ready_date}</td>
                        <td>{accrej_date}</td>
                        <td>{item.workitemId}</td>
                        <td>{item.status}</td>
                        <td><textarea cols="50" rows="1" type='text' className='OrderOverviewEditableUserInput' id={`input_extra_information${item.order_id}`} defaultValue={item.extra_information}></textarea></td>
                        <td><input type='text' className='OrderOverviewEditableUserInput' id={`input_price${item.order_id}`} defaultValue={item.order_price}></input></td>
                        <td><button disabled={false} onClick={()=>modifyRequest(index,item.order_id)}>save</button></td>
                        <td><button disabled={false} onClick={()=>modifyOrder(item)}>cancel</button></td>
                    </tr>
                );
            }
        } else {
            if(userInformationFromContext.userType === 'customer') {
                if(item.status === 'ORDERED') {
                    tableBody.push(
                        <tr key={index}><td>{item.order_id}</td><td>{item.title}</td><td>{item.description}</td><td>{ordered_date}</td><td>{started_date}</td>
                        <td>{ready_date}</td><td>{accrej_date}</td><td>{item.workitemId}</td><td>{item.status}</td><td>{item.extra_information}</td><td>{item.order_price}€</td>
                        <td><button disabled={false} onClick={()=>modifyOrder(item.order_id)}>modify</button></td>
                        <td><button disabled={false} onClick={()=>deleteOrder(item)}>delete</button></td>
                        </tr>
                    );
                } else if(item.status === 'READY') {
                    tableBody.push(
                    <tr key={index}><td>{item.order_id}</td><td>{item.title}</td><td>{item.description}</td><td>{ordered_date}</td><td>{started_date}</td>
                    <td>{ready_date}</td><td>{accrej_date}</td><td>{item.workitemId}</td><td>{item.status}</td><td>{item.extra_information}</td><td>{item.order_price}€</td>
                    <td><button disabled={false} onClick={()=>acceptOrder(item.order_id)}>accept</button></td>
                    <td><button disabled={false} onClick={()=>rejectOrder(item.order_id)}>reject</button></td>
                    </tr>
                    );
                } 
                else 
                {
                    tableBody.push(
                        <tr key={index}><td>{item.order_id}</td><td>{item.title}</td><td>{item.description}</td><td>{ordered_date}</td><td>{started_date}</td>
                        <td>{ready_date}</td><td>{accrej_date}</td><td>{item.workitemId}</td><td>{item.status}</td><td>{item.extra_information}</td><td>{item.order_price}€</td>
                        <td><button disabled={true} onClick={()=>modifyOrder(item.order_id)}>modify</button></td>
                        <td><button disabled={true} onClick={()=>deleteOrder(item)}>delete</button></td>
                        </tr>
                    );
                }
            } else {
                let finishButton, startButton; 
                
                
                if(item.status === 'ORDERED') {
                    startButton = <td><button disabled={false} onClick={()=>startOrder(item)}>start</button></td>
                    finishButton = <td><button disabled={true} onClick={()=>finishOrder(item)}>finish</button></td>
                } else if (item.status === 'STARTED') {
                    startButton = <td><button disabled={true} onClick={()=>startOrder(item)}>start</button></td>
                    finishButton = <td><button disabled={false} onClick={()=>finishOrder(item)}>finish</button></td>
                } else {
                    startButton = <td><button disabled={true} onClick={()=>startOrder(item)}>start</button></td>
                    finishButton = <td><button disabled={true} onClick={()=>finishOrder(item)}>finish</button></td>
                }
                tableBody.push(
                    <tr key={index}>
                        <td>{item.order_id}</td>
                        <td>{item.customerId}</td>
                        <td>{item.lastname}</td>
                        <td>{item.firstname}</td>
                        <td>{item.title}</td>
                        <td>{item.description}</td>
                        <td>{ordered_date}</td>
                        <td>{started_date}</td>
                        <td>{ready_date}</td>
                        <td>{accrej_date}</td>
                        <td>{item.workitemId}</td>
                        <td>{item.status}</td>
                        <td>{item.extra_information}</td>
                        <td>{item.order_price}€</td>
                        <select id={`changeStatusOption${item.order_id}`}>
                            {statusArray}
                        </select>
                        <td><button disabled={false} onClick={()=>changeStatus(item)}>status</button></td>
                        {startButton}
                        {finishButton}
                        <td><button disabled={false} onClick={()=>modifyOrder(item.order_id)}>modify</button></td>
                        <td><button disabled={false} onClick={()=>deleteOrder(item)}>delete</button></td>
                    </tr>
                );

            }
        }
        
        
    });
    if(data.length === 0) {
        return <div className='orderOverviewTableNoDataDiv'><b>{noData}</b></div>
    } else {
    return(
        <div className='orderOverviewTableDiv'>
            <h3> Your orders: </h3>
            
            <table className='orderOverViewTable'>
                <thead key='orderOverviewTableTHead'>
                    <tr key='orderOverviewTableHead'>{tableHead}</tr>
                </thead>
                <tbody key='orderOverviewTableTBody'>
                    {tableBody}
                </tbody>
            </table>
        </div>
        )
        }
    }
  } 
  async function changeStatus(order) {
    var newStatus = document.getElementById('changeStatusOption'+order.order_id).value;
    console.log(newStatus);
    let updatedOrder = order;
    updatedOrder.status = newStatus;
    console.log(updatedOrder);
    var res = await apiUpdateOrderInformation(updatedOrder);
    if(!res.includes('error')) {
        setUpdateInfo("Order #" + order.order_id + "'s status has been successfully modified to " + newStatus);
    } else {
        console.log(res);
        setUpdateInfo("An error occured while updating order #"+ order.order_id + ", errorInformation: " + res);
    }
    setReload(!reload);
  }

  async function modifyRequest(index,id) {
      //call api with item and field inputs
    if(userInformationFromContext.userType === 'admin') {
        let title = 'input_title'+id;
        let desc = 'input_description'+id;
        let info = 'input_extra_information'+id;
        let price = 'input_price'+id
        let descItem = document.getElementById(desc).value;
        let infoItem = document.getElementById(info).value;
        let titleItem = document.getElementById(title).value;
        let priceItem = document.getElementById(price).value;

        let data = orderData;
        data[index].description = descItem;
        data[index].extra_information = infoItem;
        data[index].title = titleItem;
        data[index].order_price = priceItem;

        setOrderData(data); 
        let res = await apiUpdateOrderInformation(data[index]);
        setUpdateInfo(res);
        setModifyableRows('');
    } else {
        let desc = 'input_description'+id;
        let info = 'input_information'+id;
        let descItem = document.getElementById(desc).value;
        let infoItem = document.getElementById(info).value;
        let data = orderData;
        data[index].description = descItem;
        data[index].extra_information = infoItem;
        setOrderData(data); 
        let res = await apiUpdateOrderInformation(data[index]);
        setUpdateInfo(res);
        setModifyableRows('');
    }

}

async function startOrder(order) {
    console.log("start order: ", order.order_id);
    let res = await apiUpdateOrderStart(order);
        setModifyableRows('');
        if(res.statusCode===200) {
            setUpdateInfo("Order #" + order.order_id+ " has been successfully started.");
        } else {
            console.log(res);
            setUpdateInfo("An error occured while updating order #"+  order.order_id + ", errorInformation: " + res.errorInformation);
        }
    setReload(!reload);
}

async function finishOrder(order) {
    console.log("finish order: ", order.order_id);
    let res = await apiUpdateOrderFinish(order);
    setModifyableRows('');
    if(res.statusCode===200) {
        setUpdateInfo("Order #" + order.order_id+ " has been successfully finished.");
    } else {
        console.log(res);
        setUpdateInfo("An error occured while updating order #"+  order.order_id + ", errorInformation: " + res.errorInformation);
    }
    setReload(!reload);
}
  function modifyOrder(order_id) {
      //sets modify-mode for rows for the input order_id
      // row x contains inputfiels instead of regular fields.
    if(modifyableRows === order_id) {
        setModifyableRows('');
    } else {        
        setModifyableRows(order_id);
    }
    //provoke reload.
    setReload(!reload);
  }

  // ############### delete
  async function deleteOrder(order) {
    console.log('delete ORDER #', order.order_id);
    var result = await apiDeleteOrder(order);
    console.log("RESULT OF DELETION: ", result);
    setReload(!reload);
  }

  async function acceptOrder(order_id){
    console.log('aceppt ORDER #', order_id);
    var res = await apiPostOrderAccepReject(order_id, "ACCEPTED");
    setReload(!reload);

  }
  async function rejectOrder(order_id) {
    console.log('reject ORDER #', order_id);
    var res = await apiPostOrderAccepReject(order_id, "REJECTED");
    setReload(!reload);
  }

function generateSelections(prefetchData) {
        var arr = [];
        prefetchData.map((item1,index1) =>  {
            console.log("prefetch item1: ",item1);
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
            let data = await apiGetOrderInformation(userInformationFromContext);
            setOrderData(data);
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
            data = await apiGetOrderInformationAdmin(userInformationFromContext);
        } else {
            data = await apiGetOrderInformationAdminFiltered(userInformationFromContext, filterObj);
        }
        let prefetchStatus = await apiGetOrderStatus();
        console.log("prefetch data: ", prefetchStatus);
        await setOrderData(data);
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
        
  const errInfo = <span className='orderUpdateInfo' style={{backgroundColor:'lightsalmon'}}>{updateInfo}</span>
  const succInfo = <span className='orderUpdateInfo' style={{backgroundColor:'lightgreen'}}>{updateInfo}</span>

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




export {OrderOV};