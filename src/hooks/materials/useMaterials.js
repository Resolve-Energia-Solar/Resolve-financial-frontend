import { useState, useEffect } from 'react'
import materialService from '@/services/materialsService'

const useMaterials = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [materialTypes, setMaterialTypes] = useState([])

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const data = await materialService.getMaterials()
        setMaterialTypes(data.results)
      } catch (err) {
        setError('Erro ao carregar os tipos de materiais')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMaterial()
  }, [])

  return { loading, error, materialTypes }
}

export default useMaterials
