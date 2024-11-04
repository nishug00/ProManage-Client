import React, { useState } from 'react';
import styles from './AddPeople.module.css';
import { addMemberToBoard } from '../../../../services/member';
// import { toast } from 'react-toastify';
import toast from 'react-hot-toast';
import {validationForAddPeople} from '../../../../utils/validationForm'

function AddPeople({ setAddPeopleModalOpen }) {
    const [email, setEmail] = useState('');
    const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [errorMessages, setErrorMessages] = useState({
        email: '',
    });

    const handleCancel = () => {
        setEmail('');
        setErrorMessages({});
        setAddPeopleModalOpen(false);
      };
      const handleAddEmailClick = () => {
        const { valid, errors } = validationForAddPeople(email);
        if (!valid) {
          setErrorMessages(errors);
        }
        if (valid) {
          setConfirmationModalOpen(true);
        }
      }

    const handleConfirmAddEmail = async () => {
      console.log('Started handleConfirmAddEmail');
        try {
            const result = await addMemberToBoard({ email });
            console.log("Result from addMemberToBoard:", result);

            if (result && result.message === "Person added successfully") {
                toast.success("Email added successfully");
                setConfirmationModalOpen(false); // Close the confirmation modal
                setAddPeopleModalOpen(false); 
                console.log("Email added successfully. Confirmation modal closed.");
            } else {
                toast.error("Something went wrong");
                console.error("Unexpected result:", result);
            }
        } catch (error) {
            const errorMessage = error.response?.status === 400 ?
                "Invalid email" :
                "Something went wrong. Please try again.";

            toast.error(errorMessage);
            console.error("Error adding email:", error);
        }
    };

    return (  
        <div className={styles.addPeopleContent}>
          {!isConfirmationModalOpen && (
            <>
              <div className={styles.addPeopleTitle}>Add people to the board</div>
              <div className={styles.inputWrapper}>
                <input
                  type="email"
                  className={styles.inputField}
                  placeholder="Enter the email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errorMessages?.email && <span className={styles.error}>{errorMessages.email}</span>}
              </div>
              <div className={styles.buttonWrapper}>
                <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
                <button className={styles.confirmButton} onClick={handleAddEmailClick}>
                  Add Email
                </button>
              </div>
            </>
          )}
  
          {/* Child Confirmation Modal */}
          {isConfirmationModalOpen && (
            <div className={styles.confirmationModal}>
             <p className={styles.confirmationContent}>{email} added to board</p>
             <div className={styles.buttonWrapper}>
                <button onClick={handleConfirmAddEmail} className={styles.confirmButton}>Okay, got it!</button>
              </div>
            </div>
          )}
        </div>
    );
}

export default AddPeople;