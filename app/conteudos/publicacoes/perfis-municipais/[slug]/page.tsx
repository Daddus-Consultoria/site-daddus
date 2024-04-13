import React from "react";
import { Publish } from "@/components/publish";
import { PublishModel } from "@/lib/interfaces/publish";
import { PublishCategories } from "@/lib/constants/constants";

const mockPublish: PublishModel = {
  title: "Mock Title",
  shortDescription: "This is a short description of the mock publish.",
  longDescription:
    "This is a long description of the mock publish. It contains more detailed information about the publish.",
  category: PublishCategories.COUNTIES_ELECTORAL_PROFILE,
  authors: ["Mock Author 1", "Mock Author 2"],
  tags: ["mock", "test"],
  imageUrl: "/mock-image.jpg",
  documentUrl: "https://www.bity.com.br/assets/doc/Termo-PEP.pdf",
};

const MunicipalProfile: React.FC = () => {
  return (
    <div>
      <Publish publishData={mockPublish} />
    </div>
  );
};

export default MunicipalProfile;
