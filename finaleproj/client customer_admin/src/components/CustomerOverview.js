import React from 'react';
import { apiGetAllCustomers, apiUpdateConsumerProfileData, apiDeleteCustomer, apiDeleteOffers, apiDeleteOrders} from './apiCalls';



export class CustomerOverview extends React.Component {
    
    constructor(props)
    {
        super(props);
        this.state = {
            isLoading: false,
            changeRow: "",
            data: null,
            table:null
        }
        
    }
    resetModifyMode(item) {
        console.log("reset ChangeRow Variable to empty!");
        this.setState({changeRow: ""}, ()=> {
            console.log("data in state: ", this.state.data);
            //document.getElementById('cancel').click();
            this.componentDidMount();
        });
    }
    modifyMode(item) {
        console.log('hello world.');
        if(this.state.changeRow === '') {
            this.setState({changeRow: item.customer_id}, ()=> {
                console.log("data in state: ", this.state.data);
                this.componentDidMount();
            });
        } else {
            console.log("reset ChangeRow Variable to empty!");
            this.setState({changeRow: ""}, ()=> {
                console.log("data in state: ", this.state.data);
                document.getElementById('cancel').click();
                this.componentDidMount();
            });
        }
    }
    async modifyRequest(item) {
        let firstname, lastname, address, postal_code, city, phone_number;
        firstname = document.getElementById('input_firstname'+item.customer_id).value;
        lastname = document.getElementById('input_lastname'+item.customer_id).value;
        address = document.getElementById('input_address'+item.customer_id).value;
        postal_code = document.getElementById('input_postal_code'+item.customer_id).value;
        city = document.getElementById('input_city'+item.customer_id).value;
        phone_number = document.getElementById('input_phone_number'+item.customer_id).value;

        item.firstname = firstname;
        item.lastname= lastname;
        item.address = address;
        item.postal_code = postal_code;
        item.city = city;
        item.phone_number = phone_number;

        var result = await apiUpdateConsumerProfileData(item);

        this.setState({changeRow: ''}, function() {
            this.componentDidMount();
        });
        
        
    }
    generateTable(data) {
        console.log("generateTable", data);
        if(data.data.length < 1) {
            let noData = 'noData'
            return <div><b>{noData}</b></div>
        } else {
            let tableHead = [];
            for(var k in data.data[0]) {
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

            let tableBody = []
            data.data.map((item,index) => {
                let tableData = []
                if(item.customer_id != this.state.changeRow) {
                    for(var k in item) {
                        tableData.push(<td>{item[k]}</td>)
                    }
                    let deleteButton = <button onClick={() => this.deleteCustomer(item)}>delete customer</button>
                    let changeButton = <button onClick={() => this.modifyMode(item)}>change</button>
                    tableData.push(changeButton);
                    tableData.push(deleteButton);
                    tableBody.push(<tr>{tableData}</tr>)
                } else {
                        tableBody.push(
                            <tr>
                                <td>{item.customer_id}</td>
                                <td><input type='text' id={`input_firstname${item.customer_id}`} defaultValue={item.firstname}></input></td>
                                <td><input type='text' id={`input_lastname${item.customer_id}`} defaultValue={item.lastname}></input></td>
                                <td><input type='text' id={`input_address${item.customer_id}`} defaultValue={item.address}></input></td>
                                <td><input type='text' id={`input_postal_code${item.customer_id}`} defaultValue={item.postal_code}></input></td>
                                <td><input type='text' id={`input_city${item.customer_id}`} defaultValue={item.city}></input></td>
                                <td><input type='text' id={`input_phone_number${item.customer_id}`} defaultValue={item.phone_number}></input></td>
                                <td>{item.accountname}</td>
                                <td>{item.accountpassword}</td>
                                <td>{item.accounttype}</td>
                                <button onClick={() => this.modifyRequest(item)}>save</button>
                                <button id='cancel' onClick={() => this.resetModifyMode(item)}>cancel </button>
                            </tr>
                        );
                }

            });

            return (
            <div>
                <table>
                    <thead>
                        <tr>{tableHead}</tr>
                    </thead>
                    <tbody>
                        {tableBody}
                    </tbody>
                </table>
            </div>
            )
        }
    }

    async deleteCustomer(data) {
        console.log("delete: ", data);
        var offerDeletionResult = await apiDeleteOffers(data.customer_id);
        var orderDeletionResult = await apiDeleteOrders(data.customer_id);

        if(offerDeletionResult.status ===false  || orderDeletionResult.status === false) {
            //error, do nothing as there were errors when calling the api
        } else {
            var result = await apiDeleteCustomer(data.customer_id);

            console.log(result);
        }
        
        this.componentDidMount();
    }
    async componentDidMount() {
        var data = await apiGetAllCustomers();
        var table = this.generateTable(data);
        this.setState({table: table});
        this.setState({data: data});
    }
    render() {
        return <div>{this.state.table}</div>
    }
}