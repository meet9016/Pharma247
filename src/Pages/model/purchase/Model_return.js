import { Form } from 'formik';
import React from 'react'
import { FaCheck } from "react-icons/fa6";
import { MdOutlineSpeakerNotes } from "react-icons/md";
const Model_return = () => {
    function toggleModal() {
        document.getElementById('modal').classList.toggle('hidden')
    }
    return (
        <div>
            <div className="fixed z-10 overflow-y-auto bottom-0 w-full left-0 hidden h-screen" id="modal">
                <div className="flex items-center justify-center  pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity">
                        <div className="absolute inset-0 bg-gray-900 opacity-75" />
                    </div>
                    <span className="hidden sm:inline-block sm:align-bottom sm:h-screen">&#8203;</span>
                    <div className="inline-block bg-white  overflow-hidden  transform transition-all sm:my-8 sm:align-middle sm:max-w-screen-sm sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div className='bg-blue-500 p-3 flex justify-between'>
                            <h1 className='text-white font-semibold text-3xl '>Invoice break down</h1>
                            <div className='flex'>
                                <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded bg-blue-900 font-medium  mr-2 transition duration-500" onClick={toggleModal}><i className="fas fa-plus"></i> Submit</button>
                                <div className="close-icon mt-2 " onClick={toggleModal}></div>
                            </div>
                        </div>
                        <div className='py-4 px-4 flex'>
                            <div className='w-1/2'>

                                <div className='bg-amber-100 p-4 rounded-md mb-10'>
                                    <div className='text-amber-500 flex mb-4'>
                                        <MdOutlineSpeakerNotes className='mt-1' />
                                        <p className='text-sm ml-2'>Note</p>
                                        <span className='text-blue-400 text-sm ml-2'>(0/150)</span>
                                    </div>
                                    <textarea id="notes" rows="4" className="w-full h-26 bg-amber-100 outline-0 text-black border-b-2 border-blue-400" style={{ resize: "none" }} placeholder="type note...">
                                    </textarea>
                                </div>
                                <div className='bg-blue-100 p-4 mt-4'>
                                    <p className='cursor-pointer flex mb-2'>Mrp Total</p>
                                    <span className='flex text-blue-400'>Rs.0</span>
                                </div>
                            </div>
                            <div className='w-1/2 ml-4 cursor-pointer'>
                                <Form>
                                    <div className='flex justify-between pb-2'>
                                        <p>
                                            PTR Total
                                        </p>
                                        <h6>Rs.0</h6>
                                    </div>
                                    <div className='flex justify-between pb-2'>
                                        <a href=''>Total Discount</a>
                                        <h6 className='text-red-400'>0.00</h6>
                                    </div>
                                    <div className='flex justify-between border-b-2 pb-2'>
                                        <p className='text-lg'>
                                            GST
                                        </p>
                                        <h6 >0.00</h6>
                                    </div>
                                    <div className='flex justify-between pb-2'>
                                        <p>
                                            Bill Amount
                                        </p>
                                        <h6 >0.00</h6>
                                    </div>

                                    <div className='flex justify-between border-b-2 border-blue-500  pb-2'>
                                        <p>
                                            Round off
                                        </p>
                                        <h6 >0.00</h6>
                                    </div>
                                    <div className='flex justify-between border-b-2 border-blue-500  py-4'>
                                        <p className='text-2xl'>
                                            Net Amount
                                        </p>
                                        <h6 className='text-2xl text-blue-500 font-bold'>0</h6>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Model_return