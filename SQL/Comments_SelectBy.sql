USE [MoneFi]
GO
/****** Object:  StoredProcedure [dbo].[Comments_Select_ByEntityId]    Script Date: 6/16/2023 12:01:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Byungsu Lee
-- Create date: 5/5/2023
-- Description: A proc that select all records by EntityId and EntityTypeId.
-- Code Reviewer: Alejandro Espinosa

-- MODIFIED BY: John Nelson
-- MODIFIED DATE: 6/1/2023
-- Code Reviewer: Jessica Maslanik
-- Note: Added Mi to the select
-- =============================================


ALTER PROC [dbo].[Comments_Select_ByEntityId]
				@EntityId int
				,@EntityTypeId int

/*
	Declare @EntityId int = 20
		   ,@EntityTypeId int = 3
	
	Execute dbo.Comments_Select_ByEntityId
				@EntityId
				,@EntityTypeId
	
	select *
	from dbo.Comments as c inner join dbo.EntityTypes as et
	on c.EntityTypeId = et.Id
	inner join dbo.Users as u
	on c.CreatedBy = u.Id
	
	select * from dbo.Comments order by createdby asc
	select * from dbo.users
*/

AS

BEGIN

	SELECT c.[Id]
          ,[Subject]
          ,[Text]
          ,[ParentId]
          ,[EntityTypeId]
          ,[EntityId]
          ,[IsDeleted]
		  ,u.[Id] as AuthorId
		  ,u.[FirstName] 
		  ,u.[LastName]
		  ,u.[Mi]
		  ,u.[AvatarUrl] as Avatar
          ,c.[DateCreated]
          ,c.[DateModified]
    


	FROM [dbo].[Comments] as c 
    INNER JOIN dbo.Users as u 
	ON c.CreatedBy = u.Id 
    INNER JOIN dbo.EntityTypes as et 
	ON c.EntityTypeId = et.Id

	WHERE c.EntityTypeId = @EntityTypeId
			AND	 c.EntityId = @EntityId
    



END