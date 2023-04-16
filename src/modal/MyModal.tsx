import React from 'react'
import classes from "./MyModal.module.css";

export default function MyModal(props: any) {
    const modalClasses = [classes.myModal];
    if(props.modal){
        modalClasses.push(classes.active);
    }
    return (
        <div 
            className={modalClasses.join(' ')}
            onClick={() => props.setModal(false)}>
        <div 
            className={classes.myModalContent}
            onClick={(e) => e.stopPropagation()}>
            {props.children}
        </div>
        </div>
    )
}
