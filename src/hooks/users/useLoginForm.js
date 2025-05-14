import { useState } from 'react'
import userService from '@/services/userService'
import { setUser } from '@/store/user/userSlice'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'

const useLoginForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [formErrors, setFormErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const dispatch = useDispatch()

  const validateForm = () => {
    let errors = {}
    if (!formData.email) {
      errors.email = 'Email é obrigatório'
    }
    if (!formData.password) {
      errors.password = 'Senha é obrigatória'
    }
    return errors
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async e => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = await userService.login(formData);
      Cookies.set('access_token', data.access, { expires: 1, sameSite: 'Strict' });
      console.log('data', data);

      const userData = await userService.find(data.id, {
        expand: 'employee,employee.user_manager,employee.department,employee.role',
        fields: '*,employee.*,employee.user_manager.id,employee.user_manager.complete_name,employee.department.id,employee.department.name,employee.role.id,employee.role.name'
      });

      dispatch(
        setUser({
          user: userData,
          user_permissions: userData?.user_permissions,
          last_login: userData?.last_login,
          access_token: data?.access,
        })
      );

      setFormErrors({});
      setSuccess(true);

      router.push('/apps/commercial/sale/');
    } catch (error) {
      setError('Falha ao realizar o login. Verifique suas credenciais.');
      console.error('Erro de login:', error);
      setLoading(false);
    }
  };


  return {
    formData,
    formErrors,
    success,
    loading,
    error,
    handleInputChange,
    handleSubmit,
  }
}

export default useLoginForm
