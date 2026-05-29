import { Button } from "@mui/material";
import Header from "../../Pages/Header"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
const ErrorImage = process.env.PUBLIC_URL + '/errorImage.png';

const ErrorPage = () => {
    const history = useHistory()
    return (
        <>
            <div>
                <Header />
                <div className="container mx-auto">
                    <div className="flex flex-wrap items-center justify-center">
                        <div className="w-100 my-6">
                            <div>
                                <img src={ErrorImage} alt="Error illustration" />
                            </div>
                            <div className="justify-center flex mt-5">
                                <Button style={{ background: 'var(--color1)' }} variant="contained" onClick={() => history.push('/adminDashboard')}>Back to home</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default ErrorPage