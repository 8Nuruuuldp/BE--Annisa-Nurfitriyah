const { createApp, ref, onMounted} = Vue;
const app = createApp({
    setup() {
        const url ="http://localhost:7000/pengusaha";

        const pengusaha = ref({
            id: null,
            name: "",
            company: "",
            address: "",
            description: "",
            list: [],
            errorMessage: "",
            isError: false,
            isUpdate: false,
        });

        const getPengusaha = async () => {
            try {
                pengusaha.value.isUpdate = false;
                const resPengusaha = await axios.get(url);
                if (resPengusaha.data.length === 0)
                throw new Error("Pengusaha tidak ditemukan");
                pengusaha.value.list = resPengusaha.data;
                return resPengusaha.data;
            }catch (err) {
                pengusaha.value.isError = true;
                pengusaha.value.errorMessage = err.message;
                pengusaha.value.isUpdate = false;
            }
        };
        const getPengusahaById = async (id) => {
            try {
                const resPengusaha = await axios.get(url + `/${id}`);
                if (resPengusaha.data.length === 0)
                    throw new Error("Pengusaha tidak ditemukan");
                pengusaha.value.isUpdate = true;
                pengusaha.value.id = id;
                pengusaha.value.name = resPengusaha.data.name;
                pengusaha.value.company = resPengusaha.data.company;
                pengusaha.value.address = resPengusaha.data.address;
                pengusaha.value.description = resPengusaha.data.description;
                return resPengusaha.data;
            }catch (err) {
                pengusaha.value.name = "";
                pengusaha.value.company = "";
                pengusaha.value.address = "";
                pengusaha.value.description = "";
                pengusaha.value.isUpdate = false;
                pengusaha.value.isError = true;
                pengusaha.value.errorMessage = err.message;
            }
        };

        const deletePengusaha = async (id) => {
            try {
                pengusaha.value.isUpdate = false;
                const resPengusaha = await axios.delete(url + "/delete", {
                    data: {
                        id,
                    },
                });
                if (resPengusaha.data.lenght === 0)
                throw new Error("Pengusaha tidak ditemukan");
                pengusaha.value.list = resPengusaha.data;
                await getPengusaha();
                return resPengusaha.data;
            }catch (err) {
                pengusaha.value.isError = true;
                pengusaha.value.errorMessage = err.message;
            }
        };

        const submitPengusaha = async () => {
            try {
                pengusaha.value.isUpdate = false;
                const post = await axios.post(url + "/create", {
                    name: pengusaha.value.name,
                    company: pengusaha.value.company,
                    address: pengusaha.value.address,
                    description: pengusaha.value.description,
                });
                pengusaha.value.isError = false;
                pengusaha.value.name = "",
                pengusaha.value.company = "",
                pengusaha.value.address = "",
                pengusaha.value.description = "",
                pengusaha.value.isUpdate = false;
                if (!post) throw new Error("Gagal membuat data pengusaha");
                await getPengusaha();
            } catch (err) {
                pengusaha.value.isError = true;
                pengusaha.value.errorMessage = err.message;
            }
        };

        const updatePengusaha = async () => {
            try {
                pengusaha.value.isUpdate = true;
                const put = await axios.put(url + "/update", {
                    id: pengusaha.value.id,
                    name: pengusaha.value.name,
                    company: pengusaha.value.company,
                    address: pengusaha.value.address,
                    description: pengusaha.value.description,
                });
                pengusaha.value.isError = false;
                pengusaha.value.name = "",
                pengusaha.value.company = "",
                pengusaha.value.address = "",
                pengusaha.value.description = "",
                pengusaha.value.isUpdate = false;
                pengusaha.value.isError = true;
                if (!put) throw new Error("Gagal mengupdate data pengusaha");
                await getPengusaha();
            } catch (err) {
                pengusaha.value.isUpdate = false;
                pengusaha.value.isError = true;
                pengusaha.value.errorMessage = err.message;
            }
        };

        onMounted(async () => {
            await getPengusaha();
        });

        return {
            pengusaha,
            submitPengusaha,
            updatePengusaha,
            deletePengusaha,
            getPengusahaById,
        };

    },
}) ;

app.mount("#app");