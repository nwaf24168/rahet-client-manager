
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">الصفحة غير موجودة</p>
        <p className="text-muted-foreground mb-6">سيتم توجيهك للصفحة الرئيسية خلال ثواني...</p>
        <button 
          onClick={() => navigate("/")}
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          العودة للصفحة الرئيسية
        </button>
      </div>
    </div>
  );
};

export default NotFound;
