import { QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Tour } from "antd";
import type { TourProps } from "antd";
import { useState } from "react";

type PageGuideProps = {
  steps: TourProps["steps"];
};

export default function PageGuide({ steps }: PageGuideProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button icon={<QuestionCircleOutlined />} onClick={() => setIsOpen(true)}>
        Ver guía
      </Button>
      <Tour
        mask={false}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        steps={steps}
        type="primary"
      />
    </>
  );
}
