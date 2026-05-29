import { Form } from 'formik';
import React from 'react'
import { FaCheck } from "react-icons/fa6";
import { MdOutlineSpeakerNotes } from "react-icons/md";
const Model_sell = () => {
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
                        <div className='bg-blue-600 p-3 flex justify-between'>
                            <h1 className='text-white font-semibold text-3xl '>Invoice break down</h1>
                            <div className='flex'>
                                <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded bg-blue-900 font-medium  mr-2 transition duration-500" onClick={toggleModal}><i className="fas fa-plus"></i> Submit</button>
                                <div className="close-icon mt-2 " onClick={toggleModal}></div>
                            </div>
                        </div>
                        <div className='py-4 px-4 flex'>
                            <div className='w-1/2'>
                                <div className='border-static rounded-md p-4 mb-4'>
                                    <p className='text-lg flex mb-4'>Bill Discount</p>
                                    <div className='flex items-center relative'>
                                        <div className='border-b-2 border-gray-400'>
                                            <input type="text" id="percentageInput" disabled className="w-20 outline-0" />
                                            <span className='absolute left-0'>%</span>
                                        </div>
                                        <span className='text-blue-500 font-semibold mx-2'>OR</span>
                                        <div className='border-b-2 border-gray-400 relative'>
                                            <input type="text" id="currencyInput" disabled className="w-20 outline-0" />
                                            <span className='absolute left-0'>&#8377;</span>
                                        </div>
                                        <button type="submit" className="py-2 min-w-16 px-5 h-8 bg-blue-500 text-white rounded bg-blue-900 ml-2"> <FaCheck /></button>
                                    </div>
                                    <div>
                                        <h1 className='text-xs mt-2 text-blue-900 font-bold'>
                                            Bill Discount is only applicable on unlocked items.
                                        </h1>
                                    </div>
                                </div>
                                <div className='bg-amber-100 p-4 rounded-md'>
                                    <div className='text-amber-500 flex mb-4'>
                                        <MdOutlineSpeakerNotes className='mt-1' />
                                        <p className='text-sm ml-2'>Note</p>
                                        <span className='text-blue-400 text-sm ml-2'>(0/150)</span>
                                    </div>
                                    <textarea id="notes" rows="4" className="w-full h-20 bg-amber-100 outline-0 text-black border-b-2 border-blue-400" style={{ resize: "none" }} placeholder="type note...">
                                    </textarea>
                                </div>
                                <div className='bg-blue-100 p-4 mt-4 flex justify-between'>
                                    <p className='cursor-pointer  mb-2'>GST</p>
                                    <span className='text-blue-400'>&#8377;0</span>
                                    <p className='cursor-pointer  mb-2'>CESS</p>
                                    <span className=' text-blue-400'>&#8377;0</span>
                                    <p className='cursor-pointer  mb-2'>Margin</p>
                                    <span className=' text-blue-400'>(&#8377;0.00)%</span>
                                </div>
                            </div>
                            <div className='w-1/2 ml-4 cursor-pointer'>
                                <Form>
                                    <div className='flex justify-between pb-2'>
                                        <p>
                                            MRP Total
                                        </p>
                                        <h6>&#8377;0</h6>
                                    </div>
                                    <div className='flex justify-between pb-2'>
                                        <a href=''>Total Discount</a>
                                        <h6 className='text-red-400'>0.00</h6>
                                    </div>

                                    <div className='flex justify-between pb-2'>
                                        <p>
                                            Bill Amount
                                        </p>
                                        <h6 >0.00</h6>
                                    </div>
                                    <div className='flex justify-between pb-2'>
                                        <p>
                                            Past Due / Credit
                                        </p>
                                        <h6 >+0.00</h6>
                                    </div>
                                    <div className='flex justify-between  border-b-2  pb-2'>
                                        <p >
                                            Wallet
                                        </p>
                                        <h6 className='text-red-400'>0.00</h6>
                                    </div>
                                    <div className='flex justify-between  border-b-2  pb-2'>
                                        <p>
                                            Shipping Charges
                                        </p>
                                        <h6>0</h6>
                                    </div>
                                    <div className='flex justify-between  border-b-2  pb-2'>
                                        <p>
                                            Adjustment Amount
                                        </p>
                                        <h6 className='text-red-400'>0</h6>
                                    </div>
                                    <div className='flex justify-between border-b-2 border-blue-500  pb-2'>
                                        <p>
                                            Round off
                                        </p>
                                        <h6 >0.00</h6>
                                    </div>
                                    <div className='flex justify-between   py-4'>
                                        <p className='text-xl font-bold'>
                                            Net Payable Amount
                                        </p>
                                        <h6 className='text-2xl text-blue-600 font-bold'>0</h6>
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

export default Model_sell