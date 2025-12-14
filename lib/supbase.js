
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://xacarodvjyulefzuqtai.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);



async function uploadSingleFile(file) {

    const { data, error } = await supabase.storage.from('Safe').upload(new Date().getTime() + file.originalname, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
    })


    let path = data.path;
    let url = supabase
        .storage
        .from('Safe')
        .getPublicUrl(path);

    if (error) {
        console.log(error);
    }
    return url.data.publicUrl;
}


async function getFileUrl() {

    const { data } = supabase
        .storage
        .from('public-bucket')
        .getPublicUrl()


}



export default { uploadSingleFile, getFileUrl }