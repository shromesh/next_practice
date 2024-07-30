import { NextPage } from "next";
import { useEffect, useState } from "react";

// 「/」にアクセスした時に表示されるページコンポーネント
const IndexPage: NextPage = () => {
    // useStateを使って状態を定義
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(true);

    // マウント時に画像を読み込む
    useEffect(() => {
        fetchImage().then((newImage) => {
            setImageUrl(newImage.url);
            setLoading(false);
        });
    }, []);
    // []は、コンポーネントがマウントされたときのみ実行するという意味

    // ボタンをクリックしたときに画像を再読み込み
    const handleClick = async () => {
        setLoading(true);
        const newImage = await fetchImage();
        setImageUrl(newImage.url);
        setLoading(false);
    };

    return (
        <div>
            <button onClick={handleClick}>他のにゃんこも見る</button>
            <div>{loading ? "loading..." : < img src={imageUrl} />}</div>
        </div>
    );
};

// デフォルトエクスポートされたものがページコンポーネントとして認識される
export default IndexPage;


type Image = {
    url: string;
};

const fetchImage = async (): Promise<Image> => {
    const res = await fetch("https://api.thecatapi.com/v1/images/search");
    const images: unknown = await res.json();
    // 配列じゃないならエラー
    if (!Array.isArray(images)) {
        throw new Error("猫の画像が取得できませんでした");
    }
    const image: unknown = images[0];
    // Image型の構造でないならエラー
    if (!isImage(image)) {
        throw new Error("猫の画像が取得できませんでした");
    }
    return image;
};

// 型ガード関数
const isImage = (value: unknown): value is Image => {
    // 値がオブジェクトなのか？
    if (!value || typeof value !== "object") {
        return false;
    }
    // urlプロパティが存在し、かつ、それが文字列なのか？
    return "url" in value && typeof value.url === "string";
};
