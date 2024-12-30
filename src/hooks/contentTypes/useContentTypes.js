export default function () {

    const [data, setData] = useState();

    async function fetchContantType(id) {

        const response = await contentTypeService.find(id)
        setData(response);

    }

    useEffect(() => {

    }, []);

    return {

    }
}