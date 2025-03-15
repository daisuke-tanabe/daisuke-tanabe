'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components"
import dynamic from 'next/dynamic';
import {Container} from "@/app/_components";

const ObeliskCanvas = dynamic(
  () => import('./ObeliskCanvas').then(mod => mod.ObeliskCanvas),
  { ssr: false });

export function Page({ fullYear, totalContributions, data, startDate, endDate }) {
  return (
    <>
      <div className="py-40">
        <ObeliskCanvas data={data} />
      </div>

      {/*<div className="relative max-h-[400px]">*/}
      {/*  /!*<Container>*!/*/}
      {/*  /!*  <div>{totalContributions} contributions in {fullYear}</div>*!/*/}
      {/*  /!*</Container>*!/*/}

      {/*  <Card>*/}
      {/*    <CardHeader>*/}
      {/*      <CardTitle>{totalContributions} contributions in {fullYear}</CardTitle>*/}
      {/*    </CardHeader>*/}
      {/*    <CardContent>CARD_CONTENT</CardContent>*/}
      {/*    <CardFooter>test</CardFooter>*/}
      {/*  </Card>*/}
      {/*  <div className="absolute top-[40%] h-[40%] w-full bg-zinc-100" />*/}
      {/*  <Container className="relative">*/}
      {/*    <ObeliskCanvas data={data}/>*/}
      {/*  </Container>*/}
      {/*  /!*<Container className="relative h-[308px]">*!/*/}
      {/*  /!*  <div className="absolute max-w-[600px] -translate-x-[50%]  left-[50%] -top-[150px]">*!/*/}
      {/*  /!*<div className="absolute right-0">{totalContributions} contributions in {fullYear}</div>*!/*/}
      {/*  /!*<ObeliskCanvas data={data} />*!/*/}
      {/*  /!*</div>*!/*/}
      {/*  /!*</Container>*!/*/}
      {/*</div>*/}
    </>
  )
}
