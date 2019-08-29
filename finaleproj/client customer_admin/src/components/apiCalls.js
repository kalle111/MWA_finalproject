import { resolve } from "dns";

export async function apiPostofferAccepReject(offer, type) {
    let bodyObject = {
        offer: offer,
        type : type
    }
    let resObject = {
        data : null,
        statusCode: null,
        errorInformation: null,
        status: false
    }
    var result = null;
    try {
        result = await fetch('http://localhost:3032/customer/offers/accrej', {
                method:'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(bodyObject)
            });
            let data = await result.json();
            resObject.status = data.success;
            resObject.data = data.res;
            resObject.errorInformation = data.errorInformation;
            resObject.statusCode = data.statusCode;
            return resObject;
        } catch(error){
            resObject.statusCode = 404;
            resObject.errorInformation = error;;
            return resObject;
    }
}

export async function apiSendAnswer(offer) {
    let resObject = {
        data : null,
        statusCode: null,
        errorInformation: null,
        status: false
    }
    var result = null;
    try {
        result = await fetch('http://localhost:3032/offers/answer/', {
                method:'PUT',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(offer)
            });
            let data = await result.json();
            resObject.status = data.success;
            resObject.data = data.res;
            resObject.errorInformation = data.errorInformation;
            resObject.statusCode = data.statusCode;
            return resObject;
        } catch(error){
            resObject.statusCode = 404;
            resObject.errorInformation = error;;
            return resObject;
    }
}
export async function apiUpdateOfferInformation(offer) {
    let resObject = {
        data : null,
        statusCode: null,
        errorInformation: null,
        status: false
    }
    var result = null;
    try {
        result = await fetch('http://localhost:3032/customer/offers/', {
                method:'PUT',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(offer)
            });
            let data = await result.json();
            resObject.status = data.success;
            resObject.data = data.res;
            resObject.errorInformation = data.errorInformation;
            resObject.statusCode = data.statusCode;
            return resObject;
        } catch(error){
            resObject.statusCode = 404;
            resObject.errorInformation = error;;
            return resObject;
    }
}

export async function apiDeleteOffer(offerdetails) {
    let resObject = {
        data : null,
        statusCode: null,
        errorInformation: null,
        status: false
    }
    var result = null;
    try {
        result = await fetch('http://localhost:3032/customer/offers/delete', {
                method:'DELETE',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(offerdetails)
            });
            let data = await result.json();
            resObject.status = data.success;
            resObject.data = data.res;
            resObject.errorInformation = data.errorInformation;
            resObject.statusCode = data.statusCode;
            return resObject;
        } catch(error){
            resObject.statusCode = 404;
            resObject.errorInformation = error;;
            return resObject;
        }
}

 export async  function apiDeleteOffers(id) {
    let resObject = {
        data : null,
        statusCode: null,
        errorInformation: null,
        status: false
    }
    let input_object = {
        id: id
    }
    var result = null;
    try {
        result = await fetch('http://localhost:3032/customer/offers/deleteall', {
                method:'DELETE',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(input_object)
            });
            let data = await result.json();
            resObject.status = data.success;
            resObject.data = data.res;
            resObject.errorInformation = data.errorInformation;
            resObject.statusCode = data.statusCode;
            return resObject;
        } catch(error){
            resObject.statusCode = 404;
            resObject.errorInformation = error;;
            return resObject;
        }
}

export async function apiDeleteOrders(id) {
    let resObject = {
        data : null,
        statusCode: null,
        errorInformation: null,
        status: false
    }
    let input_object = {
        id: id
    }
    var result = null;
    try {
        result = await fetch('http://localhost:3032/customer/orders/deleteall', {
                method:'DELETE',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(input_object)
            });
            let data = await result.json();
            resObject.status = data.success;
            resObject.data = data.res;
            resObject.errorInformation = data.errorInformation;
            resObject.statusCode = data.statusCode;
            return resObject;
        } catch(error){
            resObject.statusCode = 404;
            resObject.errorInformation = error;;
            return resObject;
        }
}

export async function apiDeleteCustomer(id) {
    let resObject = {
        data : null,
        statusCode: null,
        errorInformation: null,
        status: false
    }
    let input_object = {
        id: id
    }
    var result = null;
    try {
        result = await fetch('http://localhost:3032/customer/deletionbyid', {
                method:'DELETE',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(input_object)
            });
            let data = await result.json();
            resObject.status = data.success;
            resObject.data = data.res;
            resObject.errorInformation = data.errorInformation;
            resObject.statusCode = data.statusCode;
            return resObject;
        } catch(error){
            resObject.statusCode = 404;
            resObject.errorInformation = error;;
            return resObject;
        }
}

export async function apiPostNewOffer(title, desc, info, consumerData) {
    let bodyObject = {
        offer_title : title,
        offer_desc : desc,
        offer_extra_information : info,
        offer_consumerId : consumerData.userId
    }
    let resObject = {
        data : null,
        statusCode: null,
        errorInformation: null,
        status: false
    }
    var result = null;
    try {
        result = await fetch('http://localhost:3032/customer/offers/new', {
            method:'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(bodyObject)
        });
        let data = await result.json();
        resObject.status = data.success;
        resObject.data = data.res;
        resObject.errorInformation = data.errorInformation;
        resObject.statusCode = data.statusCode;
        return resObject;
    } catch (error) {
        resObject.statusCode = 404;
        resObject.errorInformation = error;
        console.log(resObject);
        return resObject;
    }
}
export async function apiPostOrderAccepReject(order_id, type) {
    let bodyObject = {
        order_id: order_id,
        type: type
    }
    let resObject = {
        data : null,
        statusCode: null,
        errorInformation: null
    }
    var result=null;
    try {
        result = await fetch('http://localhost:3032/customer/orders/accrej', {
            method:'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(bodyObject)
        });
        let data = await result.json();
        //return data;
    } catch (error) {
        resObject.statusCode = 404;
        resObject.errorInformation = "Can't reach db.";
        console.log(error);
        //return resObject;
    }
}

export async function apiGetOfferInformation(userInformation) {
    let resObject = {
        data : null,
        statusCode: null,
        errorInformation: null
    }
    var result=null;
    try {
        result = await fetch('http://localhost:3032/customer/offers/', {
            method:'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(userInformation)
        });
        let data = await result.json();
        return data;
    } catch (error) {
        resObject.statusCode = 404;
        resObject.errorInformation = "Can't reach db.";
        console.log(error);
        return resObject;
    }
}

export async function apiGetOfferStatus() {
    let resObject = {
        data : null,
        statusCode: null,
        errorInformation: null
    }
    var result=null;
    try {
        result = await fetch('http://localhost:3032/offers/status', {
            method:'GET',
            headers: {
                'content-type': 'application/json'
            }
        });
        let data = await result.json();
        console.log("Getting order status: ", data);
        return data;
    } catch (error) {
        resObject.statusCode = 404;
        resObject.errorInformation = "Can't reach db.";
        console.log(error);
        return resObject;
    }
}

export async function apiGetOrderStatus() {
    let resObject = {
        data : null,
        statusCode: null,
        errorInformation: null
    }
    var result=null;
    try {
        result = await fetch('http://localhost:3032/orders/status', {
            method:'GET',
            headers: {
                'content-type': 'application/json'
            }
        });
        let data = await result.json();
        console.log("Getting order status: ", data);
        return data;
    } catch (error) {
        resObject.statusCode = 404;
        resObject.errorInformation = "Can't reach db.";
        console.log(error);
        return resObject;
    }
}

export async function apiGetOfferInformationAdminFiltered(userInformation, filterObj) {
    console.log("filterobject: ",filterObj);
    console.log("UserInformationfromContext: ",userInformation);
    let resObject = {
        data : null,
        statusCode: null,
        errorInformation: null
    }
    var result=null;
    try {
        result = await fetch('http://localhost:3032/offers/all/', {
            method:'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(filterObj)
        });
        let data = await result.json();
        console.log("Getting order information: ", data);
        return data;
    } catch (error) {
        resObject.statusCode = 404;
        resObject.errorInformation = "Can't reach db.";
        console.log(error);
        return resObject;
    }
}
export async function apiGetOrderInformationAdminFiltered(userInformation, filterObj) {
    console.log("filterobject: ",filterObj);
    console.log("UserInformationfromContext: ",userInformation);
    let resObject = {
        data : null,
        statusCode: null,
        errorInformation: null
    }
    var result=null;
    try {
        result = await fetch('http://localhost:3032/orders/all/', {
            method:'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(filterObj)
        });
        let data = await result.json();
        console.log("Getting order information: ", data);
        return data;
    } catch (error) {
        resObject.statusCode = 404;
        resObject.errorInformation = "Can't reach db.";
        console.log(error);
        return resObject;
    }
}

export async function apiGetOfferInformationAdmin(userInformation) {
    
    console.log("UserInformationfromContext: ",userInformation);
    let resObject = {
        data : null,
        statusCode: null,
        errorInformation: null
    }
    var result=null;
    try {
        result = await fetch('http://localhost:3032/offers/all/', {
            method:'GET',
            headers: {
                'content-type': 'application/json'
            }
        });
        let data = await result.json();
        console.log("Getting order information: ", data);
        return data;
    } catch (error) {
        resObject.statusCode = 404;
        resObject.errorInformation = "Can't reach db.";
        console.log(error);
        return resObject;
    }
}

export async function apiGetOrderInformationAdmin(userInformation) {
    
    console.log("UserInformationfromContext: ",userInformation);
    let resObject = {
        data : null,
        statusCode: null,
        errorInformation: null
    }
    var result=null;
    try {
        result = await fetch('http://localhost:3032/orders/all/', {
            method:'GET',
            headers: {
                'content-type': 'application/json'
            }
        });
        let data = await result.json();
        console.log("Getting order information: ", data);
        return data;
    } catch (error) {
        resObject.statusCode = 404;
        resObject.errorInformation = "Can't reach db.";
        console.log(error);
        return resObject;
    }
}

export async function apiGetOrderInformation(userInformation) {
    let resObject = {
        data : null,
        statusCode: null,
        errorInformation: null
    }
    var result=null;
    try {
        result = await fetch('http://localhost:3032/customer/orders/', {
            method:'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(userInformation)
        });
        let data = await result.json();
        console.log("Getting order information: ", data);
        return data;
    } catch (error) {
        resObject.statusCode = 404;
        resObject.errorInformation = "Can't reach db.";
        console.log(error);
        return resObject;
    }
}

export async function apiPostNewOrder(item) {
    console.log("Item to post new OFFER: ", item);
    var result = "";
    let resObject = {
        data : null,
        statusCode: null,
        errorInformation: null,
        status: false
    }
    try {
        result = await fetch('http://localhost:3032/customer/orders/new', {
            method:'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(item)
        });
        
        let data = await result.json();
        resObject.data = data.data;
        resObject.status = data.status;
        resObject.statusCode = data.statusCode;
        resObject.errorInformation = data.errorInformation;
        return resObject;
    } catch (error) {
        resObject.statusCode = 404;
        resObject.errorInformation = "Can't reach db.";
        resObject.status = false;
        resObject.data = result;
        console.log(error);
        return resObject;
    }
}
export async function apiUpdateOrderStart(order) {
    let resObject = {
        data : null,
        statusCode: null,
        errorInformation: null
    }
    var result=null;
    try {
        result = await fetch('http://localhost:3032/orders/start/', {
            method:'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(order)
        });
        let data = await result.json();
        resObject.data = data;
        resObject.statusCode = 200;
        console.log("Getting order information: ", data);
        return resObject;
    } catch (error) {
        resObject.statusCode = 404;
        resObject.errorInformation = "Can't reach db.";
        console.log(error);
        return resObject;
    }
}
export async function apiUpdateOrderFinish(order) {
    let resObject = {
        data : null,
        statusCode: null,
        errorInformation: null
    }
    var result=null;
    try {
        result = await fetch('http://localhost:3032/orders/finish/', {
            method:'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(order)
        });
        let data = await result.json();
        resObject.data = data;
        resObject.statusCode = 200;
        console.log("Getting order information: ", data);
        return resObject;
    } catch (error) {
        resObject.statusCode = 404;
        resObject.errorInformation = "Can't reach db.";
        console.log(error);
        return resObject;
    }
}

export async function apiGetWorkItems() {
    var result=null;
    let resObject = {
        data : null,
        statusCode: null,
        errorInformation: null
    }
    try {
        result = await fetch('http://localhost:3032/workitems/', {
            method:'GET',
        });
        let data = await result.json();
        return data;
    } catch (error) {
        resObject.statusCode = 404;
        resObject.errorInformation = "Can't reach db.";
        console.log(error);
        return "error";
    }
}
export async function apiGetAllCustomers() {
    var result=null;
    let resObject = {
        data : null,
        statusCode: null,
        errorInformation: null
    }
    try {
        result = await fetch('http://localhost:3032/customers/data/', {
            method:'GET',
        });
        let data = await result.json();
        resObject.data = data;
        resObject.statusCode = 200;
        return resObject;
    } catch (error) {
        resObject.statusCode = 404;
        resObject.errorInformation = "Can't reach db.";
        console.log(error);
        return resObject;
    }
}

export async function apiUpdateOrderInformation(order) {
    var result;
    try {
    result = await fetch('http://localhost:3032/customer/orders/', {
            method:'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(order)
        });
    let data = await result.json();
    return "Order details have been saved.";
    } catch(error) {
        console.log("an Error occured while fetching data! => ", error)
        return "An error occured while updating the order detials.";
    }  
}

export async function apiLoginAuthorization(userLogin) {
    let userStr = JSON.stringify(userLogin);
    let resObject = {
        statusCode: null,
        errorInformation: null,
        status: false //initially false.
    }
    
    var result = "";
    try {
    result = await fetch('http://localhost:3032/login', {
            method:'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(userLogin)
        });
        let data = await result.json();
        let new1 = exportObject(data);
        return new1;
    } catch(error){
        resObject.statusCode = 404;
        resObject.errorInformation = "Can't reach db.";
        return resObject;
    }
}           

export async function apiDeleteOrder(orderToDelete) {
    let resObject = {
        statusCode: null,
        errorInformation: null,
        status: false //initially false.
    }
    var result = "";
    try {
    result = await fetch('http://localhost:3032/customer/orders/delete', {
            method:'DELETE',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(orderToDelete)
        });
        let data = await result.json();
        return data;
    } catch(error){
        resObject.statusCode = 404;
        resObject.errorInformation = "Can't reach db.";
        return resObject;
    }
}


function exportObject(res) {
    let resObject = {
        statusCode: res.status,
        errorInformation: res.errorInformation,
        status: res.status,  //initially false.
        type: (res.type===undefined || res.type===null ? 'consumer' : res.type),
        userId: (res.customer_id === undefined ? null : res.customer_id)
    }
    return resObject;
}

export async function apiRegistration(newUser) {
    let str = JSON.stringify(newUser);
    let resObject = {
        statusCode: null,
        errorInformation: null,
        status: false //initially false.
    }
    var result;
    try {
    result = await fetch('http://localhost:3032/signup/new/', {
            method:'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });
    let data = await result.json();
    let new1 = exportObject(data);
    return new1;
    } catch (error) {
        resObject.statusCode = 404;
        resObject.errorInformation = "Can't reach db.";
        return resObject;
    }
}   
export async function apiGetConsumerProfileData(username) {
    var result;
    try {
    result = await fetch('http://localhost:3032/profile/', {
            method:'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(username)
        });
    let data = await result.json();
    return data;
    } catch(error) {
        console.log("an Error occured while fetching data! => ", error);
        return "error";
    }
}

export async function apiUpdateConsumerProfileData(userProfile) {
    var result;
    try {
    result = await fetch('http://localhost:3032/profile/', {
            method:'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(userProfile)
        });
    let data = await result.json();
    return data;
    } catch(error) {
        console.log("an Error occured while fetching data! => ", error)
        return "error";
    }
}

