import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
let custom = {
  textAlign: 'justify',
  color: 'green'
}

const notify = pram =>
  toast(` ${pram}`, {
    position: 'bottom-right',
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: 'light'
  })

const notifySuccess = message =>
  toast.success(`${message}`, {
    position: 'top-center',
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    style: { custom },
    progress: undefined,
    theme: 'light'
  })

const icon = '❌ ✅'

const notifyError = message =>
  toast.error(`${message}`, {
    position: 'top-center',
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: 'light'
  })

export { notify, notifySuccess, notifyError }
