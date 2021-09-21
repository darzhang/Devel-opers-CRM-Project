import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Organisation(){
    const [organisations, setOrganisations] = useState([])

    useEffect(() => {
        fetch("http://localhost:5000/organisation")
            .then(data => data.json())
            .then(data => {
                console.log(data);
                setOrganisations(data);
            })
    }, [])

    useEffect(() => {
        console.log(organisations)
    }, [organisations])

    /* const getOrganistaion = async () => {
        const BASE_URL = "http://localhost:5000";
        await axios.get(BASE_URL + "/organisation").then(res => {
            const list = res.data;
            const sortedList = list.sort((a, b) => (a.orgName > b.orgName) ? 1 : -1)
            console.log(sortedList);
            setOrganisations(sortedList);
        })
    } */

    return(
        <div>
            {
                organisations.map((data, index) => {
                    return (
                        <>
                            <h1 key={index}>{data.orgName}</h1>
                        </>
                    )
                })
            }
        </div>
    )
}