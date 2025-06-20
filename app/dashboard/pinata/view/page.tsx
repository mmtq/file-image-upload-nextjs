'use client'

import { useEffect, useState } from "react"
import { getPinataFiles } from "@/lib/actions"
import Image from "next/image"

export default function Page() {
    const [files, setFiles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchFiles() {
            const { files } = await getPinataFiles()
            console.log("Files:", files.files)
            setFiles(files.files) // adjust if response structure differs
            setLoading(false)
        }
        fetchFiles()
    }, [])

    const showFullscreenImage = (imageUrl: string) => {
        const imageWindow = window.open(imageUrl, '_blank', 'width=800,height=600')
        if (imageWindow) imageWindow.focus()
    }

    return (
        <div className="">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {files.map((file: any) => (
                        <div key={file.cid} className="relative overflow-hidden">
                            <Image
                                src={`https://maroon-electronic-gamefowl-694.mypinata.cloud/ipfs/${file.cid}`}
                                alt={file.name}
                                width={300} // required placeholder
                                height={200}
                                style={{
                                    height: "200px",
                                    width: "auto",
                                    objectFit: "cover",
                                }}
                                onClick={() => showFullscreenImage(`https://maroon-electronic-gamefowl-694.mypinata.cloud/ipfs/${file.cid}`)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
