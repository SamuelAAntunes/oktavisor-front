import React, { useEffect, useState } from 'react'
import axios from 'axios'
import * as bootstrap from 'bootstrap';
import visorConfig from '../config'

import Alert from 'react-bootstrap/Alert';
import { DragHandleRounded } from '@mui/icons-material';


const UserMassDelete = ({ selectedItems, handleClose, handleCallback }) => {

  useEffect(() => {
    var myModal = new bootstrap.Modal(document.getElementById('modalDelete'))
    myModal.show()
  }, [])


  return (
    <div className="modal fade" id="modalDelete" tabIndex="-1" aria-labelledby="modalDelete" aria-hidden="false" data-backdrop="static" data-keyboard="false">
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h3 className="modal-title fs-5" id="exampleModalLabel">Delete {selectedItems.length} user{selectedItems.length > 1 ? 's' : ''}</h3>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
          </div>

          <div className="modal-body">

            <div className="container-fluid">
              <div className="row">

                <div className='col-12'>
                  <Alert key="danger" variant="danger">
                    <b><i>Danger zone : </i></b>
                    This action is not reversible.<br/>
                    Are you sure ?
                  </Alert>
                </div>

              </div>
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>Cancel</button>
            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleCallback}>No regrets</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserMassDelete